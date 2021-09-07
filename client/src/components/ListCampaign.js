import React, {Fragment, Component} from 'react';
import {tokenName} from "../utils";
import Web3 from 'web3';
import SupportChildren from "../abis/SupportChildren.json";
import flage from '../images/Flageimage.png';
import clock from '../images/clockimage.png';
import background from '../images/Frame.png';
import '../App.css';
import Moment from 'moment';


class ListCampaign extends Component  {

    constructor(props){
        super(props);
        this.toggleSortDate = this.toggleSortDate.bind(this)
        this.state = {
            contract: null,
            account : '',
            searchTerm: '',
            isOldestFirst: true,
            campaigns: [],
            category: '',
            isActiveArray: []
        }
    }

    async componentWillMount() {
        await this.getCampaigns()
        await this.loadWeb3();
        await this.loadBlockchainData();
      } 

    async getCampaigns () {
        try {
            const response = await fetch("http://localhost:5000/campaigns")
            const jsonData = await response.json()

            this.setState({
                campaigns: jsonData
            })
        } catch (err) {
            console.log(err.message);
        }
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

            this.setState({contract: contractWeb3})

            const isActiveArray = []


            for(var i =0;i<this.state.campaigns.length;i++){
                var isActive = await contractWeb3.methods.isCampaignActive(parseInt(this.state.campaigns[i].camp_id)-1).call()
                isActiveArray.push(Boolean(isActive))
            }

            var kampanja = await contractWeb3.methods.getCampaign(2).call()

            console.log(kampanja)

            console.log(isActiveArray)

            this.setState({
                isActiveArray: isActiveArray
            })
            
        } else {
            window.alert('Smart contract not deployed to detected network')
        }
    }

    sortByDate () {
        const {campaigns} = this.state
        let newPostList = campaigns
        if (this.state.isOldestFirst) {
          newPostList = campaigns.sort((a, b) => Date.parse(a.camp_datecreated) - Date.parse(b.camp_datecreated))
        } else {
          newPostList = campaigns.sort((a, b) =>  Date.parse(a.camp_datecreated) - Date.parse(b.camp_datecreated))
        }
        this.setState({
          isOldestFirst: !this.state.isOldestFirst,
          campaigns: newPostList
        })
    }
    
    toggleSortDate (event) {
        this.sortByDate()
    }



    render(){
        return(
            <Fragment>
                <div>
                    <div className="dist2">
                    <div className="toptext">
                        <p>Together, we can make a difference in our communities.</p>
                    </div>
                    <div className="toptext">
                    <div className="textontop">
                        <div  style={{backgroundImage: `url(${background})`,backgroundRepeat: 'no-repeat',backgroundPosition:'center', font: 'Jost sans-serif'}}>
                        <p>Let's do it</p>
                        </div>			 
                    </div>
                    </div>
                    <div className="almost">
                        <select className = "category form-select"  onChange = {e => this.setState({category:e.target.value})}>
                            <option value = "">Category</option>
                            <option value = "health">Health</option>
                            <option value = "education">Education</option>
                            <option value = "last">Last wish</option>
                            <option value = "ideas">Ideas</option>
                        </select>
                        <div className="recent">
                            <button>
                                <img src={flage} alt="" height="22px" width="22px" style={{float: 'left'}} />
                                <a>Almost finished</a>  
                            </button>
                        </div>
                        <div className="recent">
                            <button onClick={evt => this.toggleSortDate(evt)}>
                                <img src={clock} alt="" height="22px" width="22px" style={{float: 'left'}} />
                                <a>Recent</a> 
                            </button>
                        </div>
                        <input type = "text" placeholder = "Search..." onChange = {evt => this.setState({searchTerm: evt.target.value})} className = "search" />
                    </div>
                    <div className = "container text-center d-flex" style = {{marginTop: "50px"}}>
                        {this.state.campaigns.filter((campaign) => {
                        if(Boolean(this.state.isActiveArray[campaign.camp_id-1])){
                            if(this.state.searchTerm == "" && this.state.category == ""){
                                return campaign;
                            }else if(campaign.camp_title.toLowerCase().includes(this.state.searchTerm.toLowerCase()) && campaign.camp_category.toLowerCase().includes(this.state.category.toLocaleLowerCase())){
                                return campaign;
                            }
                        }
                        }).map(campaign => (
                            <div className = "card" id = {campaign.camp_id} onClick = {function(){window.location.href = "/campaign/" + campaign.camp_id}} key = {campaign.camp_id} style = {{marginLeft: "90px"}}>
                                <div className = "card-img-top" >
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
            </Fragment>
        )
    }
}

export default ListCampaign;