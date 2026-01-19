require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  paths: {
    sources: ".",
    tests: ".",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-key",
      }
    },
    mainnet: {
      url: process.env.RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
