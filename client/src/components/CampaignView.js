import React, {Fragment, Component} from 'react';
import {tokenName} from "../utils";
import logo from '../logo.svg';
import Web3 from 'web3';
import SupportChildren from "../abis/SupportChildren.json";
import '../App.css';
import {NavLink} from 'react-router-dom';
import Moment from 'moment';

class CampaignView extends Component {

    constructor(props){
        super(props)
        this.state = {
          contract: null,
          account: '',
          campaign: '',
          campaignBC: '',
          amountETH: '',
          amountERC: '',
          email: '',
          path: '',
          donors: [],
          allDonors: []
        }
      }
    
      async componentWillMount() {
        await this.getCampaign();
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
    
            const camp = await contractWeb3.methods.campaigns(parseInt(this.state.campaign.camp_id-1)).call()
            var bool = await contractWeb3.methods.isCampaignActive(parseInt(this.state.campaign.camp_id-1)).call()
            console.log(camp)
            console.log(bool)

            const donors = await contractWeb3.methods.getDonors(this.state.campaign.camp_id-1).call()
            console.log(donors)

            this.setState({
              contract: contractWeb3,
              campaignBC: camp,
              allDonors: donors,
              donors: donors.slice(0, 3)
            })
    
        } else {
            window.alert('Smart contract not deployed to detected network')
        }
      }

      async getCampaign () {
        try {
            const lastItem = window.location.pathname.split("/").pop()
            const response = await fetch("http://localhost:5000/campaigns/" + lastItem)
            const jsonData = await response.json()

            this.setState({
                campaign: jsonData,
                path: '/campaign-donation/' + jsonData.camp_id
            })

        } catch (err) {
            console.log(err.message);
        }
    }
  

      render(){
          return(
            <Fragment>
                <div className="dist1">
                  <div className="middle">
                    <div className="title">
                      <a>{this.state.campaign.camp_title}</a>
                    </div>
                    <div className="mainsell">
                      {/* <img className="img" src={image15} alt="" /> */}
                      <img className = "campSlika" src = {this.state.campaign.camp_url}></img>
                    </div>
                    <div className="buttonsfraime">
                  <ol>
                      <div className="timeleft">
                        <div className="timetext">Time left</div>
                        <div className="timeclock">
                          <a>{Moment(this.state.campaign.camp_deadline).format('L')}</a>
                        </div>
                      </div>
                      <div className="buttonPos">
                        <NavLink to = {this.state.path}><button className="buttonCamp" type="button">Donate Now</button></NavLink>
                      </div>
                      <div>
                        <progress id="file" value={this.state.campaign.camp_raised} max={this.state.campaign.camp_goal}></progress>
                      </div>
                      <div>
                        <label>{this.state.campaign.camp_raised}</label><a> out of </a><label>{this.state.campaign.camp_goal}</label>
                      </div>
                      <div style = {{fontFamily: 'Bebas Neue'}}>
                        <div className="lasttopdon" style={{fontSize:'22px'}}>Top donators</div>
                        {this.state.donors.map(donor => (
                          <div  className = "listofdon">
                            <a>{donor.from}</a>
                            <a style = {{float:'right'}}>{parseFloat(donor.amount/(10**18)).toFixed(2)} {tokenName(this.state.campaign.camp_currency)}</a>
                          </div>
                        ))

                        }
                        <div className="dono">
                          <button className="seealldonators" type="button" data-toggle="modal" data-target="#exampleModal">See all donators</button>
                        </div>
                      </div>
                  
                    </ol>
                  
                </div>
                <div className="desc">		 
                  <div className="categoryCampView">
                    <strong className = "addressCampView">CRAETED BY: {this.state.campaignBC.beneficiary}  </strong>
                    <strong><a>{String(this.state.campaign.camp_category).toLocaleUpperCase()}</a></strong>
                  </div>
                  <div className="description">
                    <p>{this.state.campaign.camp_description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Donors</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {this.state.allDonors.map(donor => (
                    <div className = "listofdon">
                      <a>{donor.from}</a>
                      <a style = {{float:'right'}}>{parseFloat(donor.amount/(10**18)).toFixed(2)} {tokenName(this.state.campaign.camp_currency)}</a>
                  </div>
                  ))
                  }
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          </Fragment>
          )
      }

}
export default CampaignView;