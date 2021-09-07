import React, {Fragment, Component} from 'react';
import SupportChildren from "../abis/SupportChildren.json";
import Web3 from 'web3';
import { MaticPOSClient } from '@maticnetwork/maticjs'
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import {getCampaigns} from "../utils";

const MaticPoSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const Network = require("@maticnetwork/meta/network");
const Matic = require("@maticnetwork/maticjs");



const config = require("../config");


class L2View extends Component {

    constructor(props){
        super(props);
        this.state = {
            Networkid: 0,
            account: "",
            inputValue: "",
            burnHash: "",
            loading: true,
            maticProvider: '',
            ethereumProvider: '', 
            loading: '',
            inputDeposit: '',
            inputBurn: '', 
            inputWithdraw: '',
            currencyDeposit: '',
            currencyBurn: '0x0000000000000000000000000000000000000000',
            currencyWithdraw: '',
            campaigns: [],
            usersCampaigns: [],
            selectedCampaign: '',
            id: 60
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
      //POLYGON
      this.setState({loading: true})
      const maticProvider = new WalletConnectProvider({
          host: config.l2.MATIC_RPC,
          callbacks: {
              onConnect: console.log("matic connected"),
              onDisconnect: console.log("matic disconnected!"),
          },
      });

      const ethereumProvider = new WalletConnectProvider({
          host: config.l2.ETHEREUM_RPC,
          callbacks: {
              onConnect: console.log("mainchain connected"),
              onDisconnect: console.log("mainchain disconnected"),
          },
      });
      

      this.setState({maticProvider: maticProvider, ethereumProvider: ethereumProvider, campaigns: await getCampaigns()})


      //POLYGON

      const web3 = window.web3
        this.setState({web3: web3})
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
        //POLYGON
      const networkId = await web3.eth.net.getId()
        this.setState({Networkid: networkId})

        if (networkId === config.l2.ETHEREUM_CHAINID) {
            this.setState({loading: false})
        } else if (networkId === config.l2.MATIC_CHAINID) {
            this.setState({loading: false})
        } else {
            window.alert(" switch to  Matic or Ethereum network");
        }
        //POLYGON

      const networkData = await SupportChildren.networks[config.l2.ETHEREUM_CHAINID]
      if(networkData) {
          const abi = SupportChildren.abi
          const address = networkData.address
          const contractWeb3 = new web3.eth.Contract(abi, address)

          this.setState({contract: contractWeb3})

          const indices = []
          const isActiveArray = []
          const usersCampaigns = []

          for(var i =0;i<this.state.campaigns.length;i++){
            var campaign = this.state.campaigns[i]
            if(campaign.camp_beneficiary == this.state.account && !Boolean(campaign.camp_isActive) && !Boolean(campaign.camp_withdraw)){
              usersCampaigns.push(campaign)
            }
          }

          this.setState({
            usersCampaigns
          })

      } else {
          window.alert('Smart contract not deployed to detected network')
      }
    }

    posClientParent () {
      console.log("posClientParent")
      return new MaticPoSClient({
          network: config.l2.NETWORK,
          version: config.l2.VERSION,
          maticProvider: this.state.maticProvider,
          parentProvider: window.web3,
          parentDefaultOptions: {from: this.state.account},
          maticDefaultOptions: {from: this.state.account},
      });
    };

    posClientChild (){
      console.log("posClientChild")
      return new MaticPoSClient({
          network: config.l2.NETWORK,
          version: config.l2.VERSION,
          maticProvider: window.web3,
          parentProvider: this.state.ethereumProvider,
          parentDefaultOptions: {from: this.state.account},
          maticDefaultOptions: {from: this.state.account},
      });
    };

    depositEther = async () => {
      console.log("depositEther")
      const maticPoSClient = this.posClientParent();
      const x = this.state.inputDeposit * 1000000000000000000; // 18 decimals //TODO inputValue
      const x1 = x.toString();

      await maticPoSClient.depositEtherForUser(this.state.account, x1, {
          from: this.state.account,
      });
    };

    burnEther = async () => {
      console.log("burnEther" + this.state.selectedCampaign)
      const maticPoSClient = this.posClientChild();
      const x = this.state.selectedCampaign * 1000000000000000000; //TODO inputValue
      const x1 = x.toString();
      await maticPoSClient
          .burnERC20(config.l2.posWETH, x1, {
              from: this.state.account,
          })
          .then((res) => {
              console.log("Burn hash: " + res.transactionHash);
              this.setState({burnHash: res.transactionHash});

          }).then(async () =>{
            try {
                const body = {withdrawn: Boolean(true)};
                const response = await fetch(`http://localhost:5000/campaigns/withdraw/${this.state.id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(body)
                });
            } catch (err) {
                console.log(err.message)
            }
        });
    };

    exitEther = async () => {
      console.log("exitEther, burnHash: " + this.state.inputWithdraw)
      const maticPoSClient = this.posClientParent();
      await maticPoSClient
          .exitERC20(this.state.inputWithdraw, {
              from: this.state.account,
          })
          .then((res) => {
              console.log("exit o/p", res);
          })
    };

    depositERC20 = async () => {
      const maticPoSClient = this.posClientParent();
      const x = this.state.inputDeposit * 1000000000000000000; // 18 decimals
      const x1 = x.toString();
      await maticPoSClient.approveERC20ForDeposit(this.state.currencyDeposit, x1, {
        from: this.state.account,
      });
      await maticPoSClient.depositERC20ForUser(this.state.currencyDeposit, this.state.account, x1, {
        from: this.state.account,
      });
    };

    burnERC20 = async () => {
      const maticPoSClient = this.posClientChild();
      const x = this.state.inputBurn * 1000000000000000000;
      const x1 = x.toString();
      await maticPoSClient
        .burnERC20(this.state.currencyBurn, x1, {
          from: this.state.account,
        })
        .then((res) => {
          this.setState({burnHash: res.transactionHash});
        });
    }

    depositSwitch = () => {
      if(this.state.currencyDeposit == "0x0000000000000000000000000000000000000000"){
        this.depositEther()
      }else{
        this.depositERC20()
      }
    }

    burnSwitch = () => {
      if(this.state.currencyBurn == "0x0000000000000000000000000000000000000000"){
        this.burnEther()
      }else{
        this.burnERC20()
      }
    }

    render(){
        return(
            <div>
              <div className = "container" style = {{marginLeft: '35%', marginTop: '30px'}}>
                <div>
                  <div className = "depositBox">
                    <h3>Deposit assets to Polygon</h3>
                    <div style = {{display: "flex", marginLeft: '80px', marginTop: '20px'}}>
                      <input className = 'form-control' type = "number" step = "0.0000001" placeholder = "Deposit amount" onChange = {evt => this.setState({inputDeposit: evt.target.value})}/>
                      <select id="kripto" onChange = {evt => this.setState({currencyDeposit: evt.target.value})}>
                        <option value="0x0000000000000000000000000000000000000000">ETH</option>
                        <option value="0xdc31ee1784292379fbb2964b3b9c4124d8f89c60">DAI</option>
                        <option value="0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c">ENJ</option>
                        <option value="0x3845badAde8e6dFF049820680d1F14bD3903a5d0">SAND</option>
                        <option value="0xa117000000f279d81a1d3cc75430faa017fa5a2e">ANT</option>
                      </select>
                    </div>
                    <button className = "burnBtn" onClick={this.depositSwitch} disabled={ this.state.Networkid !== 0 && this.state.Networkid === config.l2.MATIC_CHAINID }>DEPOSIT</button>
                  </div>
                  <div className = "burnBox">
                    <h3 >BURN THE ASSETS FROM POLYGON</h3>
                    <select className = 'form-select' onChange = {evt => this.setState({selectedCampaign: evt.target.value, id: evt.target[evt.target.selectedIndex].id})}>
                      <option id = {69}>Pick your campaign</option>
                        {this.state.usersCampaigns.map((campaign) => (
                          <option key = {campaign.camp_id} id = {campaign.camp_id+0} value = {campaign.camp_l2raised}>{campaign.camp_title}</option>
                        ))}
                    </select>
                    <div  style = {{display: "flex", marginLeft: '60px', marginTop: '20px'}}>
                      <input className = 'form-control' type = "number" step = "0.0000001" placeholder = {this.state.selectedCampaign} onChange = {evt => this.setState({inputBurn: this.state.selectedCampaign})} disabled/>
                      <select id="kripto" onChange = {evt => this.setState({currencyBurn: evt.target.value})}>
                        <option value="0x0000000000000000000000000000000000000000">ETH</option>
                        <option value="0x6b175474e89094c44da98b954eedeac495271d0f">DAI</option>
                        <option value="0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c">ENJ</option>
                        <option value="0x3845badAde8e6dFF049820680d1F14bD3903a5d0">SAND</option>
                        <option value="0xa117000000f279d81a1d3cc75430faa017fa5a2e">ANT</option>
                      </select>
                    </div>
                    <button className = "burnBtn" onClick={this.burnSwitch} onChange = {evt => this.setState({inputBurn: this.state.selectedCampaign})} disabled={this.state.Networkid !== 0 && this.state.Networkid === config.l2.ETHEREUM_CHAINID}>Burn</button>
                    <p className = "burnParagraph">Burn hash: {this.state.burnHash}</p>
                  </div>
                  <div className = "withdrawBox">
                  <h3>Withdraw the amount that you have burned</h3>
                    <div  style = {{display: "flex", marginLeft: '60px', marginTop: '20px'}}>
                      <input className = 'form-control' placeholder = "Place the burn hash" onChange = {evt => this.setState({inputWithdraw: evt.target.value})}/>
                      <select id="kripto" onChange = {evt => this.setState({currencyWithdraw: evt.target.value})}>
                        <option value="0x0000000000000000000000000000000000000000">ETH</option>
                        <option value="0x6b175474e89094c44da98b954eedeac495271d0f">DAI</option>
                        <option value="0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c">ENJ</option>
                        <option value="0x3845badAde8e6dFF049820680d1F14bD3903a5d0">SAND</option>
                        <option value="0xa117000000f279d81a1d3cc75430faa017fa5a2e">ANT</option>
                      </select>
                    </div>
                      <button className = "burnBtn" onClick={this.exitEther} disabled={ !(this.state.Networkid !== 0 && this.state.Networkid === config.l2.ETHEREUM_CHAINID)}>Withdraw</button>
                  </div>
                </div>
              </div>
            </div>
        );
    }

}

export default L2View;