import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from "web3modal";
import lit from './Lit/lit';
import LitNft from "./artifacts/contracts/LitNft.sol/LitNft.json";
import Modal from './components/Modal';
import Nft from './components/Nft';
import './css/App.css';

// NFT Contract Address
const litNFTContractAddress = "0x45892C0Cb0860f96BA6d36a8C0f967E517ab5105";

const mumbaiTestnet = {
  chainId: "0x13881",
  chainName: "Matic Mumbai",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  },
  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
};

/**
 * App component
 * @returns 
 */
function App() {
  
  const web3Modal = new Web3Modal({ network: "mumbai", cacheProvider: true });

  const [litNftContract, setLitNftContract] = useState(null);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    // fetchNFT
    const fetchNfts = async () => {
      const fetchedNfts = await litNftContract.fetchNfts();
      getDisplayNfts(fetchedNfts);
    }
    if (litNftContract !== null) {
      fetchNfts();
    }
  }, [litNftContract]);

  /**
   * Connect Wallet method
   */
  const connectWallet = async () => {
    const connection = await web3Modal.connect();
    await switchToMumbaiTestnet();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const _litNftContract = new ethers.Contract(litNFTContractAddress, LitNft.abi, signer);
    setLitNftContract(_litNftContract);
  }

  /**
   * switchToMumbaiTestnet method
   */
  const switchToMumbaiTestnet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: mumbaiTestnet.chainId }], // chainId must be in hexadecimal numbers
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [mumbaiTestnet],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    } else {
      alert("Please install Metamask");
    }
  }

  /**
   * mintLitNft method
   * @param {*} name 
   * @param {*} imageUrl 
   * @param {*} description 
   */
  const mintLitNft = async (name, imageUrl, description) => {
    const { encryptedString, encryptedSymmetricKey } = await lit.encryptText(description);

    // Convert blob to base64 to pass as a string to Solidity
    const blobToBase64 = blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
    const encryptedDescriptionString = await blobToBase64(encryptedString);

		let transaction = await litNftContract.mintLitNft(name, imageUrl, encryptedDescriptionString, encryptedSymmetricKey);
    await transaction.wait();

    const _nfts = await litNftContract.fetchNfts();
    await getDisplayNfts(_nfts);
  }

  /**
   * getDisplayNfts method
   * @param {*} fetchedNfts 
   */
  const getDisplayNfts = (fetchedNfts) => {
    const _nfts = [];
    let nft = {};
    for (let idx = fetchedNfts.length - 1; idx > -1; idx--) {
      const { name, imageUrl, encryptedDescription, encryptedSymmetricKey } = fetchedNfts[idx];
      nft = { name, imageUrl, encryptedDescription, encryptedSymmetricKey }
      _nfts.push(nft);
    }

    setNfts(_nfts);
  }

  const showModal = () => {
    const mintNftButton = document.getElementById('modal');
    mintNftButton.classList.add('show');
  }

  const closeModal = () => {
    const mintNftButton = document.getElementById('modal');
    mintNftButton.classList.remove('show');
  }

  return (
    <div className="App">
      <h1>Sample Lit App</h1>
      {!litNftContract ? (
        <div>
          <button className='mintNft' onClick={connectWallet}>Connect Wallet</button>
        </div>
      ) : (
        <div>
          <button 
            className='mintNft' 
            onClick={showModal}
          >
            Mint Lit NFT
          </button>
          <div id='modal' className='hidden'>
            <Modal 
              mintLitNft={mintLitNft} 
              closeModal={closeModal} 
            />
          </div>
          <div className='nfts'>
            {nfts.map((nft, idx) => {
              return (
                <Nft nft={nft} key={idx} />
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
