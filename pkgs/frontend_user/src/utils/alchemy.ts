import { Alchemy, Network } from "alchemy-sdk";

/**
 * Alchemy用のインスタンスを作成するメソッド
 */
export const createAlchemy = ():any => {
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.MATIC_MUMBAI,
  };
  
  const alchemy = new Alchemy(settings);

  return alchemy;
}