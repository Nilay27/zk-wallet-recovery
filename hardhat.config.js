require('hardhat-circom');
// require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();


const infuraApiKey = process.env.ARBISCAN_API_KEY || "";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.22',
      },
    ],
  },
  circom: {
    inputBasePath: './circuits',
    ptau: 'https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau',
    circuits: [
      {
        name: 'poseidonhash',
        // Explicitly generate groth16
        protocol: 'groth16',
      },
    ],
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraApiKey}`,
      accounts: [process.env.PVT_KEY] // Ensure PVT_KEY is correctly set in .env
    },
    arbitrum_goerli: {
      url: `https://arbitrum-goerli.publicnode.com`,
      accounts: [process.env.PVT_KEY] // Ensure PVT_KEY is correctly set in .env
    },
    scrollSepolia: {
      url: 'https://sepolia-rpc.scroll.io',
      accounts: [process.env.PVT_KEY]
    },
    zkEVM: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [process.env.PVT_KEY],
      },
    calibrationnet: {
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [process.env.PVT_KEY],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      arbitrum_goerli: process.env.ARBISCAN_API_KEY,  
      scrollSepolia: "abc",
      polygonZkEVMTestnet: process.env.POLYGONSCAN_API_KEY,
      calibrationnet: process.env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: 'scrollSepolia',
        chainId: 534351,
        urls: {
          apiURL: 'https://sepolia-blockscout.scroll.io/api',
          browserURL: 'https://sepolia-blockscout.scroll.io/',
        },
      },
      {
        network: 'arbitrum_goerli',
        chainId: 421613,
        name: 'Arbitrum Goerli',
        urls: {
          apiURL: 'https://api-goerli.arbiscan.io/api',
          browserURL: 'https://goerli.arbiscan.io',
        },
      },
    ],
  },
};
