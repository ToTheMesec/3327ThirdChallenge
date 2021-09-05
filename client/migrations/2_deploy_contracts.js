const SupportChildren = artifacts.require("SupportChildren");
const SupportChildrenNFT = artifacts.require("SupportChildrenNFT");

module.exports = async function (deployer) {
  require('dotenv').config();

  const UniswapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const UniswapFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const WETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"; //goerli weth 

  await deployer.deploy(SupportChildren, UniswapFactory, UniswapRouter, WETH);
  const supportChildrenContract = await SupportChildren.deployed();

  await deployer.deploy(SupportChildrenNFT, supportChildrenContract.address);
};