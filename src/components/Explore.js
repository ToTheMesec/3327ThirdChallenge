import React, { Component } from 'react';
import {Image} from 'cloudinary-react'
import Web3 from 'web3';
import SaveChildren from '../abis/SaveChildren.json'
import './App.css';

class Explore extends Component{

    constructor(props){
        super(props)
        this.state = {
            contract: null,
             account: ''
        }
    }

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }
    
      async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      }
    
      async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
    
        const networkId = await web3.eth.net.getId()
        const networkData = SaveChildren.networks[networkId]
        if(networkData) {
          const abi = SaveChildren.abi
          const address = networkData.address
          const contract = new web3.eth.Contract(abi, address)
          this.setState({ contract: contract})

          //printing all campaigns
          const totalSupply = await contract.methods.getCampaignsLength().call()
          const mainDiv = document.getElementById("myID")
          for(var i = 0;i<totalSupply;i++){
            const campaign = await contract.methods.campaigns(i).call()
            console.log(campaign)

            const _div = document.createElement('div')
            _div.className = 'card'

            const cardBody = document.createElement('div')
            cardBody.className = "card-body"

            const title = document.createElement('h1')
            title.className = "card-title"
            title.innerHTML = campaign.name

            const description = document.createElement('p')
            description.className = "card-text"
            description.innerHTML = campaign.description

            const image = document.createElement('img')
            image.src = campaign.imageUrl
            image.className = "card-img-top"
            console.log(image.src)

            cardBody.appendChild(title)
            cardBody.appendChild(description)

            _div.appendChild(image)
            _div.appendChild(cardBody)

            mainDiv.appendChild(_div)
          }


    
        } else {
          window.alert('Smart contract not deployed to detected network')
        }
    }
    render() {
        return (
          <div>
            <header id="header" class="d-flex align-items-center">
                <div class="container d-flex align-items-center justify-content-between">

                  <h1 class="logo"><a href="index.html">TTM</a></h1>

                  <nav id="navbar" class="navbar">
                    <ul>
                      <li><a class="nav-link scrollto" href="#hero">Home</a></li>
                      <li><a class="nav-link scrollto" href="#about">About</a></li>
                      <li class="active"><a href="#marketplace"><span>Marketplace</span> <i class="bi bi-chevron-down"></i></a></li>
                      <li className = "navbar-nav px-3">
                        <li className = "nav-item text-nowrap d-none d-sm-none d-sm-block">
                          <small className = "text-white"><span id = "account">{this.state.account}</span></small>
                        </li>
                      </li>
                    </ul>
                    <i class="bi bi-list mobile-nav-toggle"></i>
                  </nav>

              </div>
            </header>
            <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex text-center">
                  
                </main>
              </div>
              <div className = "row text-center" style = {{backgroundImage: this.state.urlSlike, backgroundRepeat: 'no-repeat'}}>
                <div id = "myID" className = "col-mb-3 mb-3">

                </div>
              </div>
            </div>
          </div>
        );
      }

}

export default Explore;