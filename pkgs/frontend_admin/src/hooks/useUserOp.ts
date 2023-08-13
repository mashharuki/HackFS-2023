import { ethers } from "ethers";
import { Client, Presets } from "userop";
import lit from "../Lit/lit";
import { ERC20_ABI, ERC721_ABI } from "../utils";
import { CLIOpts } from "../utils/types";
import { ENTRY_POINT_ADDRESS } from "./../utils/Contents";
import { Nft, getLitNft } from "./useContract";

const {
  VITE_BUNDLER_RPC_URL,
  VITE_PAYMASTER_RPC_URL,
  VITE_PAYMASTER_CONTEXT,
  VITE_CONNECT_ADDRESS_PRIVATE_KEY
}:any = process.env;

/**
 * getSigningKey method
 */
const getSigningKey = async(): Promise<string> => {
  // fetch
  const nfts: Nft[] = await getLitNft();
  // get nft data
  const nft: Nft = nfts[0];
  console.log("nft:", nft);

  // decrypt data
  const encryptedDescriptionBlob = await (await fetch(nft.encryptedDescription)).blob();

  let signingKey: string;

    try {
      // decryptText
      signingKey = await lit.decryptText(encryptedDescriptionBlob, nft.encryptedSymmetricKey);
    } catch (error: any) {
      if (error.errorCode === "incorrect_access_control_conditions") {
        console.error("decrypt fail..");
        return "";
      } else {
        console.error("decrypt fail..");
        return "";
      }
    }

    return signingKey;
}

/**
 * create SimpleAccount Object method
 */
const createSimpleAccountObject = async(
  factoryAddress: string,
  opts: CLIOpts
): Promise<any> => {

  const paymaster = opts.withPM
    ? Presets.Middleware.verifyingPaymaster(
      VITE_PAYMASTER_RPC_URL,
      VITE_PAYMASTER_CONTEXT
      )
    : undefined;

  // get simpleAccount object
  // VITE_CONNECT_ADDRESS_PRIVATE_KEYは、Web3Authで生成されたものにする。
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    VITE_CONNECT_ADDRESS_PRIVATE_KEY,
    VITE_BUNDLER_RPC_URL,
    ENTRY_POINT_ADDRESS,
    factoryAddress,
    paymaster
  );

  return simpleAccount;
}

/**
 * get AccountContract address method
 * @param factoryAddress factoryAddress
 * @return AccountWallet address
 */
export async function getAddress(
  factoryAddress: string
) {
  // get simpleAccount object
  // VITE_CONNECT_ADDRESS_PRIVATE_KEYは、Web3Authで生成されたものにする。
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    VITE_CONNECT_ADDRESS_PRIVATE_KEY,
    VITE_BUNDLER_RPC_URL,
    ENTRY_POINT_ADDRESS,
    factoryAddress,
  );

  console.log("simple Account:", simpleAccount);
  const address = simpleAccount.getSender();
  return address;
}

/**
 * transfer native token method
 * @param t 
 * @param amt 
 * @param opts 
 * @param factoryAddress 
 */
export async function transfer(
  t: string, 
  amt: string, 
  opts: CLIOpts, 
  factoryAddress: string
): Promise<string> {
  // get simpleAccount object
  const simpleAccount = await createSimpleAccountObject(factoryAddress, opts);
  const client = await Client.init(VITE_BUNDLER_RPC_URL, ENTRY_POINT_ADDRESS);

  const target = ethers.utils.getAddress(t);
  const value = ethers.utils.parseEther(amt);
  // send user Op
  const res = await client.sendUserOperation(
    simpleAccount.execute(target, value, "0x"),
    {
      dryRun: opts.dryRun,
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);

  return ev?.transactionHash!;
}

/**
 * ERC20Token transfer method
 * @param tkn 
 * @param t 
 * @param amt 
 * @param opts 
 * @param factoryAddress 
 */
export async function erc20Transfer(
  tkn: string,
  t: string,
  amt: string,
  opts: CLIOpts,
  factoryAddress: string,
): Promise<string> {
  // get simpleAccount object
  const simpleAccount = await createSimpleAccountObject(factoryAddress, opts);
  const client = await Client.init(VITE_BUNDLER_RPC_URL, ENTRY_POINT_ADDRESS);

  const provider = new ethers.providers.JsonRpcProvider(VITE_BUNDLER_RPC_URL);

  const token = ethers.utils.getAddress(tkn);
  const to = ethers.utils.getAddress(t);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  // get name & Symbol
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.utils.parseUnits(amt, decimals);
  console.log(`Transferring ${amt} ${symbol}...`);
  // sendOp
  const res = await client.sendUserOperation(
    simpleAccount.execute(
      erc20.address,
      0,
      erc20.interface.encodeFunctionData("transfer", [to, amount])
    ),
    {
      dryRun: opts.dryRun,
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);

  return ev?.transactionHash!;
}

/**
 * ERC20Token approve method
 * @param tkn 
 * @param s 
 * @param amt 
 * @param opts 
 * @param factoryAddress 
 */
export async function erc20Approve(
  tkn: string,
  s: string,
  amt: string,
  opts: CLIOpts,
  factoryAddress: string,
): Promise<string>  {
  // get simpleAccount object
  const simpleAccount = await createSimpleAccountObject(factoryAddress, opts);
  const client = await Client.init(VITE_BUNDLER_RPC_URL, ENTRY_POINT_ADDRESS);

  const provider = new ethers.providers.JsonRpcProvider(VITE_BUNDLER_RPC_URL);

  const token = ethers.utils.getAddress(tkn);
  const spender = ethers.utils.getAddress(s);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  // get name & Symbol
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.utils.parseUnits(amt, decimals);
  console.log(`Approving ${amt} ${symbol}...`);

  // userOp
  const res = await client.sendUserOperation(
    simpleAccount.execute(
      erc20.address,
      0,
      erc20.interface.encodeFunctionData("approve", [spender, amount])
    ),
    {
      dryRun: opts.dryRun,
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);

  return ev?.transactionHash!;
}

/**
 * ERC20 Token batch transfer
 * @param tkn 
 * @param t 
 * @param amt 
 * @param opts 
 * @param factoryAddress 
 */
export async function erc20BatchTransfer(
  tkn: string,
  t: Array<string>,
  amt: string,
  opts: CLIOpts,
  factoryAddress: string,
) {
   // get simpleAccount object
   const simpleAccount = await createSimpleAccountObject(factoryAddress, opts);
   const client = await Client.init(VITE_BUNDLER_RPC_URL, ENTRY_POINT_ADDRESS);
 
   const provider = new ethers.providers.JsonRpcProvider(VITE_BUNDLER_RPC_URL);
 
  const token = ethers.utils.getAddress(tkn);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  // get toekn symbol & decimals
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.utils.parseUnits(amt, decimals);

  let dest: Array<string> = [];
  let data: Array<string> = [];
  
  t.map((addr) => addr.trim()).forEach((addr) => {
    dest = [...dest, erc20.address];
    data = [
      ...data,
      erc20.interface.encodeFunctionData("transfer", [
        ethers.utils.getAddress(addr),
        amount,
      ]),
    ];
  });
  console.log(
    `Batch transferring ${amt} ${symbol} to ${dest.length} recipients...`
  );

  // send userOp (Batch Tx)
  const res = await client.sendUserOperation(
    simpleAccount.executeBatch(dest, data),
    {
      dryRun: opts.dryRun,
      onBuild: (op) => console.log("Signed UserOperation:", op),
    } 
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
}

/**
 * ERC721Token transfer method
 * @param tkn 
 * @param t 
 * @param id 
 * @param opts 
 * @param factoryAddress 
 */
export async function erc721Transfer(
  tkn: string,
  t: string,
  id: string,
  opts: CLIOpts,
  factoryAddress: string,
): Promise<string> {
  // get simpleAccount object
  const simpleAccount = await createSimpleAccountObject(factoryAddress, opts);
  const client = await Client.init(VITE_BUNDLER_RPC_URL, ENTRY_POINT_ADDRESS);

  const provider = new ethers.providers.JsonRpcProvider(VITE_BUNDLER_RPC_URL);

  const token = ethers.utils.getAddress(tkn);
  const to = ethers.utils.getAddress(t);
  const tokenId = id;

  // create ERC721 Contract Object
  const erc721 = new ethers.Contract(token, ERC721_ABI, provider);
  // get token name & symbol
  const [name, symbol] = await Promise.all([
    erc721.name(),
    erc721.symbol()
  ]);

  console.log(`Transferring ${name},${symbol}...`);

  // userOprationを送信する。
  const res = await client.sendUserOperation(
    simpleAccount.execute(
      erc721.address,
      0,
      erc721.interface.encodeFunctionData("transferFrom", [simpleAccount.getSender(), to, tokenId])
    ),
    {
      dryRun: opts.dryRun,
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);

  return ev?.transactionHash!;
}

