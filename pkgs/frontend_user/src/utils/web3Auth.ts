import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";

/**
 * createWeb3AuthObject
 */
export const createWeb3AuthObject = (chainId: string): any => {
  const web3auth = new Web3Auth({
    clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID!,
    web3AuthNetwork: "testnet",
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: chainId,
      rpcTarget: process.env.NEXT_PUBLIC_BUNDLER_RPC_URL,
    },
  });

  return web3auth;
}

/**
 * getPrivateKey method
 * @param provider 
 * @returns 
 */
export const getPrivateKey = async (provider: SafeEventEmitterProvider) => {
  return (await provider.request({
    method: "private_key",
  })) as string;
};