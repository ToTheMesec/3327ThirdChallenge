require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('@truffle/hdwallet-provider')
const fs = require('fs')

require('dotenv').config();
var mnemonic = process.env["NEMONIC"];
var tokenKey = process.env["ENDPOINT_KEY"];

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () =>
          new HDWalletProvider({
            mnemonic: {
              phrase: mnemonic
            },
            providerOrUrl: "https://rinkeby.infura.io/v3/" + tokenKey,
            numberOfAddresses: 1,
            shareNonce: true,
          }),
      network_id: '4',
      // provider: function() {
      //   return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/" + tokenKey);
      // },
      // network_id: 4,
      // gas: 4500000,
      // gasPrice: 10000000000,
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://goerli.infura.io/v3/' + tokenKey)
      },
      network_id: '5', // eslint-disable-line camelcase
      gas: 4465030,
      gasPrice: 10000000000,
    },
    polygon: {
      provider: () =>
          new HDWalletProvider(
              mnemonic,
              'https://rpc-mainnet.matic.network/'
          ),
      network_id: '137',
      skipDryRun: true
      },
      // RANUJE SE SA truffle migrate --network polygon --reset
      polygonTestnet: {
          provider: () =>
              new HDWalletProvider(
                  mnemonic,
                  'https://rpc-mumbai.matic.today/'
              ),
          network_id: '80001',
          skipDryRun: true
      },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.6.6",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}