import React, { Component } from 'react';
import {tokenName, getCampaigns} from "../utils";
import Web3 from 'web3';
import SupportChildren from "../abis/SupportChildren.json";
import '../App.css';
import profimg from '../images/profileimage.png';
import donoapp from '../images/donoapp.png';
import { Line } from 'react-chartjs-2';
import {NavLink} from 'react-router-dom';
import Moment from 'moment';


class UserDashBoard extends Component{

    constructor(props){
        super(props)
        this.state = {
            contract: null,
            account: '',
            campaigns: [],
            campaignsBC: [],
            labels: [],
            data: [],
            isActiveArray: []
        }
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
        
    } 
    
    async loadWeb3(){
        if(window.ethereum){
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        }else if(window.web3){
          window.web3 = new Web3(window.web3.currentProvider)
        }else{
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
    
    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accountWeb3 = await web3.eth.getAccounts()
        this.setState({account: accountWeb3[0]})

        const addressField = document.getElementById("address")
        addressField.innerHTML = accountWeb3[0]

        web3.eth.getBalance(this.state.account, function(err, result) {
          if (err) {
            console.log(err)
          } else {
            const val = document.getElementById("value")
            var res = web3.utils.fromWei(result, "ether")
            val.innerHTML = parseFloat(res).toFixed(2) + " ETH"
          }
        })
    
        const networkId = await web3.eth.net.getId()
        const networkData = await SupportChildren.networks[networkId]
        if(networkData) {
            const abi = SupportChildren.abi
            const address = networkData.address
            const contractWeb3 = new web3.eth.Contract(abi, address)
    
            this.setState({contract: contractWeb3, campaigns: await getCampaigns()})

            const campaignsContract = await contractWeb3.methods.getCampaigns().call()
            const indices = []

            for(var i =0;i<campaignsContract.length;i++){
              if(campaignsContract[i].beneficiary == this.state.account){
                indices.push(i+1);
              }
            }

            const labels = []
            const data = []
            const isActiveArray = []

            for(var i =0;i<this.state.campaigns.length;i++){
              if(indices.includes(parseInt(this.state.campaigns[i].camp_id))){
                labels.push(this.state.campaigns[i].camp_title);
                data.push(this.state.campaigns[i].camp_raised);
              }
            }

            for(var i =0;i<this.state.campaigns.length;i++){
                var isActive = await contractWeb3.methods.isCampaignActive(parseInt(this.state.campaigns[i].camp_id)-1).call()
                isActiveArray.push(Boolean(isActive))
            }


            this.setState({
              campaignsBC:indices,//niz indeksa korisnikovih kampanja u nizu kampanja iz kontrakta
              labels: labels,
              data: data,
              isActiveArray: isActiveArray//da li je korisnikova kampanja aktivna
            })
    
        } else {
            window.alert('Smart contract not deployed to detected network')
        }
    }


    render() {
        return (
            <div>
              <title>My profile</title>
              <div className="dist2">
                <div className = "content">
                  <div className="heading ">
                    <a>Donations</a>
                    <NavLink to="/create-campaign" id = "random"><button className = "buttonfund">Create fundraise</button></NavLink>
                  </div>
                  <div>
                  <Line
                    data = {{
                        labels: this.state.labels,
                        datasets: [
                            {
                                label: 'Amount that campaigns have raised',
                                data: this.state.data,
                                borderColor: 'Green',
                                tension: 0.1, /* Koliko je ostra linija promeniti po potrebi */
                            }
                        ]
                    }}
                    height = {300}
                    width = {600}
                    options = {{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }

                            }]
                        }
                    }}
                />
                  </div>
                  <div className="heading">
                    <a>Fundraise</a>
                  </div>
                  <div className="acinac">
                    <a style = {{fontSize: "25px"}}>Active</a>
                  </div>
                  <div className = "row">
                    <div className = "col-sm" style = {{paddingLeft: '100px'}}>
                      {this.state.campaigns.filter((campaign) => {

                          if(this.state.campaignsBC.includes(parseInt(campaign.camp_id)) && Boolean(this.state.isActiveArray[campaign.camp_id-1])){
                            return campaign;
                          }
                      }).map(campaign => (
                        <div className = "card" id = {campaign.camp_id} onClick = {function(){window.location.href = "/campaign/" + campaign.camp_id}} key = {campaign.camp_id} style = {{marginLeft: "50px"}}>
                        <div className = "card-img-top">
                        <img src = {campaign.camp_url}></img>
                        </div>
                        <div className = "card-body">
                          <p className = "card-title">{campaign.camp_title}</p>
                          <p className = "card-text">{campaign.camp_description}</p>
                          <p style={{color : "#959595", marginBottom: "1px"}}>Created {Moment(campaign.camp_deadline).format('L')}</p>
                          <progress value = {campaign.camp_raised} max = {campaign.camp_goal} className = "progress"></progress>

                          <p className = "card-text"><strong>Donated {campaign.camp_raised} {tokenName(campaign.camp_currency)}</strong> of {campaign.camp_goal} {tokenName(campaign.camp_currency)}</p>
                        </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="acinac">
                    <a style = {{fontSize: "25px"}}>Inactive</a>
                  </div>
                  <div className = "row">
                    <div className = "col-sm" style = {{paddingLeft: '100px'}}>
                      {this.state.campaigns.filter((campaign) => {
                          console.log(this.state.campaigns[0])
                          if(this.state.campaignsBC.includes(parseInt(campaign.camp_id)) && !Boolean(this.state.isActiveArray[campaign.camp_id-1])){
                            return campaign;
                          }
                      }).map(campaign => (
                        <div className = "card" id = {campaign.camp_id}  key = {campaign.camp_id} style = {{marginLeft: "50px"}}>
                        <div className = "card-img-top">
                        <img src = {campaign.camp_url}></img>
                        </div>
                        <div className = "card-body">
                          <p className = "card-title">{campaign.camp_title}</p>
                          <p className = "card-text">{campaign.camp_description}</p>
                          <p style={{color : "#959595", marginBottom: "1px"}}>Created {Moment(campaign.camp_deadline).format('L')}</p>
                          <progress value = {campaign.camp_raised} max = {campaign.camp_goal} className = "progress"></progress>
                          <p className = "card-text"><strong>Donated {campaign.camp_raised} {tokenName(campaign.camp_currency)}</strong> of {campaign.camp_goal} {tokenName(campaign.camp_currency)}</p>
                        </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
    }



}

export default UserDashBoard;