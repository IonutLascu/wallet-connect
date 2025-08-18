import { ethers } from 'ethers';

export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    console.error('No Ethereum provider found. Install MetaMask.');
    return null;
  }
};

export const getSigner = async () => {
  const provider = getProvider();
  if (provider) {
    const signer = provider.getSigner();
    return signer;
  }
  return null;
};

export const getContract = (address, abi) => {
  const provider = getProvider();
  if (provider) {
    return new ethers.Contract(address, abi, provider);
  }
  return null;
};