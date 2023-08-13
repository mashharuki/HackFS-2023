import { usePolybase } from "@polybase/react";
import * as PushAPI from '@pushprotocol/restapi';
import { Web3Auth } from "@web3auth/modal";
import * as Ethers from "ethers";
import { useEffect, useState } from "react";
import { Presets } from "userop";
import ERC20Transfer from "../Components/ERC20Transfer";
import ERC721Transfer from "../Components/ERC721Transfer";
import Notifications from '../Components/Notifications';
import ERC20Table from "../Components/TokenTable/ERC20Table";
import NftTable from "../Components/TokenTable/NftTable";
import Transfer from "../Components/Transfer";
import TxTable from '../Components/TxTable';
import SliderBar from '../Components/common/Slidebar';
import Spinner from "../Components/common/Spinner";
import { loadNotifications } from "../hooks/usePush";
import { POLYGONSCAN_URL } from "../utils/Contents";
import { createAlchemy } from "../utils/alchemy";
import { CLIOpts } from "../utils/types";
import { createWeb3AuthObject, getPrivateKey } from "../utils/web3Auth";
import { createSimpleAccountObject } from "./../hooks/useUserOp";
import { DB_COLLECTION_NAME, SIMPLE_ACCOUNT_FACTORY_ADDRESS } from './../utils/Contents';

const {
  VITE_BUNDLER_RPC_URL
} = import.meta.env;

/**
 * Home Component
 * @returns 
 */
const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [spams, setSpams] = useState<PushAPI.ParsedResponseType[]>([]);
  const [txs, setTxs] = useState<any[]>([]);
  const [notificateFlg, setNotificateFlg] = useState(false);
  const [txFlg, setTxFlg] = useState(false);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [account, setAccount] = useState<Presets.Builder.SimpleAccount | null>(null);

  // create alchemy object
  const alchemy = createAlchemy();
  // Polybase config
  const polybase = usePolybase();
  // factoryAddressを取得する。
  const factoryAddress = SIMPLE_ACCOUNT_FACTORY_ADDRESS;

  /**
   * setAuthorized method
   * @param w3auth 
   */
  const setAuthorized = async (w3auth: Web3Auth) => {
    if (!w3auth.provider) {
      throw new Error("web3authprovider not initialized yet");
    }
    const authenticateUser = await w3auth.authenticateUser();
    // get private key
    const privateKey = await getPrivateKey(w3auth.provider);

    const opts: CLIOpts = {
      dryRun: false, // Set to true if you want to perform a dry run
      withPM: false, // Set to true if you want to use a paymaster
    };
    // create contract account
    const acc = await createSimpleAccountObject(privateKey, opts);
    setIdToken(authenticateUser.idToken);
    setAccount(acc);
  };

  /**
   * login method
   */
  const login = async () => {
    if (!web3auth) {
      throw new Error("web3auth not initialized yet");
    }
    // connect
    const web3authProvider = await web3auth.connect();
    if (!web3authProvider) {
      throw new Error("web3authprovider not initialized yet");
    }

    setAuthorized(web3auth);
  };

  /**
   * logout method
   */
  const logout = async () => {
    if (!web3auth) {
      throw new Error("web3auth not initialized yet");
    }
    // logout
    await web3auth.logout();
    setAccount(null);
    setIdToken(null);
  };


  useEffect(() => {
    /**
     * 初期化メソッド
     */
    const init = async() => {
      setIsLoading(true);

      // get network & chainID info
      const provider = new Ethers.providers.JsonRpcProvider(VITE_BUNDLER_RPC_URL);
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      // create web3Auth object
      const web3auth = createWeb3AuthObject("0x" + chainId.toString(16));
      console.log("web3auth:", web3auth)
      // initModal
      await web3auth.initModal();

      setWeb3auth(web3auth);
      //setAuthorized(web3auth);

      if(account !== null && account !== undefined) {
        // get contract address
        const contractAddress = account!.getSender();

        // get own's NFT
        await alchemy.nft.getNftsForOwner(contractAddress).then((res:any) => {
          setNfts(res.ownedNfts);
        });
        // get own's ERC20 token
        await alchemy.core.getTokenBalances(contractAddress).then((res:any) => {
          setTokens(res.tokenBalances);
        });

        // get notifications
        const notifications = await loadNotifications(false, contractAddress);
        setSpams(notifications);
        console.log("spams:", notifications);

        var res = await polybase.collection(`${DB_COLLECTION_NAME}`)
                            .where("sender", "==", `${contractAddress}`)
                            .sort("date", "desc")
                            .get();
        setTxs(res.data);
      }

      setIsLoading(false);
    };
    init();
  }, []);

  return(
    <div className="App">
      <header className="App-header">
        {isLoading ? (
          <Spinner/>
        ) : (
          <>
            {idToken ? (
              <div className='flex flex-row'>
                <SliderBar 
                  setNotificateFlg={setNotificateFlg} 
                  setTxFlg={setTxFlg} 
                  spams={spams !== undefined ? spams.length : 0}
                  txs={txs !== undefined ? txs.length : 0}
                  logout={logout}
                />
                {notificateFlg && (
                  <div>
                    <Notifications spams={spams} />
                  </div>
                )}
                {txFlg && (
                  <div>
                    <>{txs !== undefined && <TxTable txs={txs} />}</>
                  </div>
                )}  
                {(!notificateFlg && !txFlg ) && (
                  <div>
                    <div className="mb-4">
                      My Assets
                    </div>
                    <h2 className='text-base mb-8'>
                      my address: 
                      <a href={POLYGONSCAN_URL + account?.getSender()}>
                        {account?.getSender()}
                      </a>
                    </h2>
                    {/* NFT Balance Table */}
                    <NftTable nfts={nfts} />
                    {/* ERC20 Token Balance Table */}
                    <ERC20Table tokens={tokens} />
                    <div className='flex flex-row gap-16 mt-4 mb-4'>
                      <Transfer setIsLoading={setIsLoading} factoryAddress={factoryAddress}/>
                      <ERC20Transfer setIsLoading={setIsLoading} factoryAddress={factoryAddress}/>
                      <ERC721Transfer setIsLoading={setIsLoading} factoryAddress={factoryAddress}/>
                    </div>
                  </div>
                )}
              </div>
            ): (
              <button
                type="button"
                onClick={login}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Login
              </button>
            )}
          </>
        )}
      </header>
    </div>
  )
}

export default Home;