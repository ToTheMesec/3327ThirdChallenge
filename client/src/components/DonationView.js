import React, { Component} from 'react';
import '../App.css';
import Web3 from 'web3';
import SupportChildren from "../abis/SupportChildren.json";
import IERC20 from '../abis/IERC20.json';
import NFT from '../abis/NFT.json';
import {tokenName, getCampaign} from "../utils";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";

const config = require("../config");


const MaticPoSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const Network = require("@maticnetwork/meta/network");
const Matic = require("@maticnetwork/maticjs");


class App extends Component{

    constructor(props){
        super(props)
        this.state = {
          contract: null,
          contractAddress: '',
          account: '',
          campaign: '',
          campaignBC: '',
          amount: '',
          email: '',
          currency: '0x0000000000000000000000000000000000000000',
          path: '',
          receipt: '',
          maticProvider: '',
          ethereumProvider: '',
          donoSwitch: ''
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

        this.setState({maticProvider: maticProvider, ethereumProvider: ethereumProvider})


        const web3 = window.web3
        // Load accoun
        const accountWeb3 = await web3.eth.getAccounts()
        this.setState({account: accountWeb3[0]})

        console.log(accountWeb3[0])

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

            const util = await getCampaign()

            this.setState({
                campaign: util[0],
                path: util[1]
            })

            console.log(this.state.campaign.camp_l2raised)


            const camp = await contractWeb3.methods.getCampaign(parseInt(this.state.campaign.camp_id)-1).call()

            const sveKampanje = await contractWeb3.methods.getCampaigns().call()

            console.log(sveKampanje)

            console.log(camp)
            
            const res = await getCampaign()

            this.setState({
              contract: contractWeb3,
              contractAddress: address,
              campaignBC: camp,
            })
    
        } else {
            window.alert('Smart contract not deployed to detected network')
        }
      }

    posClientParent () {
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
        return new MaticPoSClient({
            network: config.l2.NETWORK,
            version: config.l2.VERSION,
            maticProvider: window.web3,
            parentProvider: this.state.ethereumProvider,
            parentDefaultOptions: {from: this.state.account},
            maticDefaultOptions: {from: this.state.account},
        });
    };


    donateSwitch = (evt) => {
        evt.preventDefault()
        if(this.state.donoSwitch == 'mainnet'){
            if(this.state.currency == "0x0000000000000000000000000000000000000000"){
                this.donateETH(evt)
            }else{
                this.donateERC(evt)
            }
        }else{
            if(this.state.currency == "0x0000000000000000000000000000000000000000"){
                this.depositEther()
            }else{
                // this.depositERC20Poly(evt)
            }
        }
    }

    depositEther = async () => {
        console.log("depositEther")
        const maticPoSClient = this.posClientParent();
        const x = this.state.amount * 1000000000000000000; // 18 decimals //TODO inputValue
        const x1 = x.toString();
  
        await maticPoSClient.depositEtherForUser(this.state.campaignBC.beneficiary, x1, {
            from: this.state.account,
        }).then(async () => {
            try {
                const raised = parseFloat(this.state.campaign.camp_l2raised) + parseFloat(this.state.amount)
                console.log(raised)
                const body = {raised : raised}
                const response = await fetch(`http://localhost:5000/campaigns/layer2/${this.state.campaign.camp_id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(body)
                });
            } catch (err) {
                console.log(err.message)
            }
        })
      };

    donateERC = async (evt) =>{
        evt.preventDefault()
        const web3 = window.web3

        

        const abi = IERC20.abi

        const tokenContract = new web3.eth.Contract(abi, this.state.currency)

        await tokenContract.methods.approve(this.state.contractAddress, String(this.state.amount*(10**18))).send({from: this.state.account})
        .then(() =>{
            this.state.contract.methods.donate(this.state.campaign.camp_id-1, this.state.currency, String((this.state.amount)*(10**18)))
            .send({from: this.state.account}).once('receipt', (receipt) => {
                this.setState({
                  receipt: receipt
                })
                console.log(receipt)
            })
            .then(async () =>{
                try {
                    const raised = await this.state.contract.methods.getCampaign(this.state.campaign.camp_id-1).call()
                    console.log(raised.receivedAmount)
                    const body = {raised : raised.receivedAmount/(10**18)};
                    const response = await fetch(`http://localhost:5000/campaigns/${this.state.campaign.camp_id}`, {
                        method: "PUT",
                        headers: {"Content-Type" : "application/json"},
                        body: JSON.stringify(body)
                    });
                    const lastItem = window.location.pathname.split("/").pop()
                    // window.location = "/campaign/" + this.state.campaign.camp_id;
                } catch (err) {
                    console.log(err.message);
                }
            }).then(async() =>{
                const networkId = await web3.eth.net.getId();
                const networkData = NFT.networks[networkId];
                if(networkData){
                    const abi = NFT.abi;
                    const address = networkData.address
                    const nft = new web3.eth.Contract(abi, address)

                    nft.methods.mint(this.state.receipt, this.state.account).send({from: this.state.account})
                }
            })
        })
        
    }

    donateETH = (evt) =>{
        evt.preventDefault();

        
        const web3 = window.web3
        var campId = this.state.campaign.camp_id-1
        this.state.contract.methods.donateETH(campId, this.state.email)
        .send({from: this.state.account, value: parseFloat(this.state.amount)*(10**18)})
        .then(async () =>{
            try {
                const raised = await this.state.contract.methods.getCampaign(this.state.campaign.camp_id-1).call()
                console.log(raised.receivedAmount)
                const body = {raised : raised.receivedAmount/(10**18)};
                const response = await fetch(`http://localhost:5000/campaigns/${this.state.campaign.camp_id}`, {
                    method: "PUT",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify(body)
                });
                const lastItem = window.location.pathname.split("/").pop()
                // window.location = "/campaign/" + this.state.campaign.camp_id;
            } catch (err) {
                console.log(err.message);
            }
        }).then(async() =>{
            const networkId = await web3.eth.net.getId();
            const networkData = NFT.networks[networkId];
            if(networkData){
                const abi = NFT.abi;
                const address = networkData.address
                const nft = new web3.eth.Contract(abi, address)

                nft.methods.mint(this.state.account, this.state.receipt).send({from: this.state.account})
            }
        })
    }

    render(){
    return (
        <div>
            <div className="alloncenter">
            <div>
            <div className="fundinfotext">
                <a>FUNDRAISING INFORMATION</a>
            </div>
            <div className="image15">
                <img src = {this.state.campaign.camp_url}></img>
                <div className="thankyou" >
                <p>THANK YOU FOR DONATING:</p>
                <a>{this.state.campaign.camp_title}</a>
                </div>
            </div>
            </div>
            <select className = "form-select" onChange = {evt => this.setState({donoSwitch: evt.target.value})}>
                <option value = 'mainnet'>Ethereum MAINNET</option>
                <option value = 'polygon'>Polygon(MATIC)</option>
            </select>
            <div>
            <div className="enterText">
            <a>ENTER AMOUNT</a>
            </div>
            <div style={{fontSize:'14px'}}>
            <a>Enter the amount you wnat to donate</a>
            </div>
            <div className="cryptolist">
            <form>
                <input className="inputform" placeholder="ENTER AMOUNT" type="number" step = "0.00000001" onChange = {evt => this.setState({amount: evt.target.value})}></input>
                <input placeholder= "ENTER EMAIL" className = "inputform" style = {{width: '200px', marginLeft: '15px'}} type = "text" onChange = {evt => this.setState({email: evt.target.value})}></input>
            </form>
            <div className="listofitems" style={{float:'right'}}>
                <select style={{borderStyle: 'none', fontSize:'30px',fontFamily: 'Bebas Neue', width: '80px', marginRight: '50px', marginTop: '-50px'}} onChange = {evt => this.setState({currency: evt.target.value})}>
                <option value="0x0000000000000000000000000000000000000000">ETH</option>
                <option value="0xdc31ee1784292379fbb2964b3b9c4124d8f89c60">DAI</option>
                <option value="0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c">ENJ</option>
                <option value="0x3845badAde8e6dFF049820680d1F14bD3903a5d0">SAND</option>
                <option value="0xa117000000f279d81a1d3cc75430faa017fa5a2e">ANT</option>
                </select>
            </div>
            </div>
            <div>
                <button className="buttonFundCamp" type="button" onClick={evt => this.donateSwitch(evt)}>Donate Now</button>
            </div>
            </div>
            <div className="claimnft" >
            <b><center>DONATE AND CLAIM YOUR UNIQE NFT!</center></b>
            </div>
            <div>
            <div>
            </div>
            </div>
            </div>
        </div>
    );
}
}

export default App;