import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

const {
  VITE_CONNECT_ADDRESS_PRIVATE_KEY,
  VITE_ETH_MAINNET_RPC_URL,
  VITE_RPC_URL
} = import.meta.env;

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

/**
 * getEthereum function
 * @returns 
 */
export const getEthereum = (): MetaMaskInpageProvider | null => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const { ethereum } = window;
    return ethereum;
  }
  return null;
};

/**
 * get shortAddress
 * @param address wallet address
 */
export const shortAddress = (address:any) => {
  if (address.length <= 8) {
      return address;
  } else {
      const firstThree = address.substring(0, 4);
      const lastThree = address.substring(address.length - 4);
      return `${firstThree}...${lastThree}`;
  }
};

/**
 * getSinger Object
 */
export const getSigner = ():any => {
  const signer = new ethers.Wallet(VITE_CONNECT_ADDRESS_PRIVATE_KEY!);
  return signer;
};

/**
 * getProvider Object
 */
export const getProvider = ():any => {
  const provider = new ethers.providers.JsonRpcProvider(VITE_ETH_MAINNET_RPC_URL!)
  return provider;
}

/**
 * getMumbaiProvider Object
 */
export const getMumbaiProvider = ():any => {
  const provider = new ethers.providers.JsonRpcProvider(VITE_RPC_URL!)
  return provider;
}