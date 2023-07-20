require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");

const GOERLI__TESTNET_RPC_URL = process.env.INFURA_GOERLI_ENDPOINT;
const GOERLI_TESTNET_PRIVATE_KEY = process.env.PRIVATE_KEY;

const ETHEREUM_MAINET_API = process.env.ETHEREUM_MAINET_API;

task("accounts", "Prints the list of accounts", async () => {

  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
  
});

module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: {
      goerli: ETHEREUM_MAINET_API,
    }
  },
  networks: {
    goerliTestnet: {
      url: GOERLI__TESTNET_RPC_URL,
      accounts: [GOERLI_TESTNET_PRIVATE_KEY],
      chainId: 5,
    },
  },
};
