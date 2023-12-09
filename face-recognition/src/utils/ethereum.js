import { ethers } from 'ethers';

// 1: Mainnet
// 5: Goerli
// 1337: localhost network

const networkId = process.env.NEXT_PUBLIC_NETWORK_ID || '1337';
const networks = {
  1: 'mainnet',
  5: 'goerli',
  1337: 'localhost',
};
export const networkName = networks[networkId];

export const getEthereumObject = () => {
  const { ethereum } = window;
  if (!ethereum) return null;

  console.log('Network ID:', ethereum.networkVersion);

  return ethereum;
};

export const setupEthereumEventListeners = (ethereum) => {
  const provider = new ethers.providers.Web3Provider(ethereum, 'any');
  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      // window.location.reload();
    }
  });

  window.ethereum.on('accountsChanged', async (accounts) => {
    window.location.reload();
  });

  return ethereum;
};

export const connectWallet = async () => {
  const { ethereum } = window;
  if (!ethereum) return null;

  await ethereum.request({ method: 'eth_requestAccounts' });
  // window.location.reload();
};

export const getCurrentAccount = async () => {
  const { ethereum } = window;

  const accounts = await ethereum.request({ method: 'eth_accounts' });

  if (!accounts || accounts?.length === 0) {
    return null;
  }
  const account = accounts[0];
  return account;
};

export const getSignedContract = (address, abi) => {
  const { ethereum } = window;

  const provider = new ethers.providers.Web3Provider(ethereum, 'any');

  const signer = provider.getSigner();
  return new ethers.Contract(address, abi, signer);
};
