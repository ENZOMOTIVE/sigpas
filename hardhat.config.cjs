const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

const PrivateKey = 'c2796498187181a425ed0b2200f58ae7ad045accde7ef720044d18d11e1d0ffb';
const config = {
  solidity: {
    version: "0.8.27",  // Set to the version your contract is using
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    opencampus: {
      url: 'https://open-campus-codex-sepolia.drpc.org',
      accounts: [PrivateKey],
    },
  },
};

module.exports = config;
