import { MetaMaskInpageProvider } from "@metamask/providers";
import { JsonRpcProvider, Wallet } from "ethers";

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
  const signer = new Wallet(process.env.NEXT_PUBLIC_CONNECT_ADDRESS_PRIVATE_KEY!);
  return signer;
};

/**
 * getProvider Object
 */
export const getProvider = ():any => {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_ETH_MAINNET_RPC_URL!)
  return provider;
}

/**
 * getMumbaiProvider Object
 */
export const getMumbaiProvider = ():JsonRpcProvider => {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!)
  return provider;
}