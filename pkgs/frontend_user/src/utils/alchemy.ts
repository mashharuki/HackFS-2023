import { Alchemy, Network } from "alchemy-sdk";

/**
 * Alchemy用のインスタンスを作成するメソッド
 */
export const createAlchemy = ():any => {
  const {
    VITE_ALCHEMY_API_KEY
  } = import.meta.env;
  
  const settings = {
    apiKey: VITE_ALCHEMY_API_KEY,
    network: Network.MATIC_MUMBAI,
  };
  
  const alchemy = new Alchemy(settings);

  return alchemy;
}