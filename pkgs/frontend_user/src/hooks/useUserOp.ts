import { ERC20_ABI, ERC721_ABI } from "@/utils";
import { ENTRY_POINT_ADDRESS, SIMPLE_ACCOUNT_FACTORY_ADDRESS, pmContext } from "@/utils/Contents";
import { CLIOpts } from "@/utils/types";
import { Contract, JsonRpcProvider, Wallet, getAddress, parseEther, parseUnits } from "ethers";
import { Client, Presets } from "userop";

/**
 * create SimpleAccount Object method
 * @param privateKey
 * @param opts
 */
export const createSimpleAccountObject = async(
  privateKey: string,
  opts: CLIOpts
): Promise<any> => {

  const paymaster = opts.withPM
    ? Presets.Middleware.verifyingPaymaster(
      process.env.NEXT_PUBLIC_PAYMASTER_RPC_URL!,
      pmContext
    ) : undefined;

  // get simpleAccount object
  // NEXT_PUBLIC_CONNECT_ADDRESS_PRIVATE_KEYは、Web3Authで生成されたものにする。
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    new Wallet(privateKey) as any,
    process.env.NEXT_PUBLIC_BUNDLER_RPC_URL!,
    ENTRY_POINT_ADDRESS,
    SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    paymaster
  );

  return simpleAccount;
}

/**
 * get AccountContract address method
 * @param privateKey
 * @return AccountWallet address
 */
export async function getContractAddress(
  privateKey: string
) {
  const opts: CLIOpts = {
    dryRun: false, // Set to true if you want to perform a dry run
    withPM: false, // Set to true if you want to use a paymaster
  };
  const paymaster = opts.withPM
    ? Presets.Middleware.verifyingPaymaster(
      process.env.NEXT_PUBLIC_PAYMASTER_RPC_URL!,
      pmContext
    ) : undefined;
    
  // get simpleAccount object
  // NEXT_PUBLIC_CONNECT_ADDRESS_PRIVATE_KEYは、Web3Authで生成されたものにする。
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    new Wallet(privateKey) as any,
    process.env.NEXT_PUBLIC_BUNDLER_RPC_URL!,
    ENTRY_POINT_ADDRESS,
    SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    paymaster
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
 * @param privateKey
 */
export async function transfer(
  t: string, 
  amt: string, 
  opts: CLIOpts, 
  privateKey: string
): Promise<string> {
  // get simpleAccount object
  const simpleAccount = await createSimpleAccountObject(privateKey, opts);
  const client = await Client.init(process.env.NEXT_PUBLIC_BUNDLER_RPC_URL!, ENTRY_POINT_ADDRESS);

  const target = getAddress(t);
  const value = parseEther(amt);
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
 * @param privateKey
 */
export async function erc20Transfer(
  tkn: string,
  t: string,
  amt: string,
  opts: CLIOpts,
  privateKey: string,
): Promise<string> {
  // get simpleAccount object
  const simpleAccount = await createSimpleAccountObject(privateKey, opts);
  const client = await Client.init(process.env.NEXT_PUBLIC_BUNDLER_RPC_URL!, ENTRY_POINT_ADDRESS);

  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!);

  const token = getAddress(tkn);
  const to = getAddress(t);
  const erc20 = new Contract(token, ERC20_ABI, provider);
  // get name & Symbol
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = parseUnits(amt, decimals);
  console.log(`Transferring ${amt} ${symbol}...`);
  // sendOp
  const res = await client.sendUserOperation(
    simpleAccount.execute(
      token,
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
 * @param privateKey
 */
export async function erc20Approve(
  tkn: string,
  s: string,
  amt: string,
  opts: CLIOpts,
  privateKey: string,
): Promise<string>  {
  // get simpleAccount object
  const simpleAccount = await createSimpleAccountObject(privateKey, opts);
  const client = await Client.init(process.env.NEXT_PUBLIC_BUNDLER_RPC_URL!, ENTRY_POINT_ADDRESS);

  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!);

  const token = getAddress(tkn);
  const spender = getAddress(s);
  const erc20 = new Contract(token, ERC20_ABI, provider);
  // get name & Symbol
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = parseUnits(amt, decimals);
  console.log(`Approving ${amt} ${symbol}...`);

  // userOp
  const res = await client.sendUserOperation(
    simpleAccount.execute(
      token,
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
 * @param privateKey
 */
export async function erc20BatchTransfer(
  tkn: string,
  t: Array<string>,
  amt: string,
  opts: CLIOpts,
  privateKey: string,
) {
   // get simpleAccount object
   const simpleAccount = await createSimpleAccountObject(privateKey, opts);
   const client = await Client.init(process.env.NEXT_PUBLIC_BUNDLER_RPC_URL!, ENTRY_POINT_ADDRESS);
 
   const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!);
 
  const token = getAddress(tkn);
  const erc20 = new Contract(token, ERC20_ABI, provider);
  // get toekn symbol & decimals
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = parseUnits(amt, decimals);

  let dest: Array<string> = [];
  let data: Array<string> = [];
  
  t.map((addr) => addr.trim()).forEach((addr) => {
    dest = [...dest as any, erc20.address];
    data = [
      ...data,
      erc20.interface.encodeFunctionData("transfer", [
        getAddress(addr),
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
 * @param privateKey
 */
export async function erc721Transfer(
  tkn: string,
  t: string,
  id: string,
  opts: CLIOpts,
  privateKey: string,
): Promise<string> {
  // get simpleAccount object
  const simpleAccount = await createSimpleAccountObject(privateKey, opts);
  const client = await Client.init(process.env.NEXT_PUBLIC_BUNDLER_RPC_URL!, ENTRY_POINT_ADDRESS);

  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!);

  const token = getAddress(tkn);
  const to = getAddress(t);
  const tokenId = id;

  // create ERC721 Contract Object
  const erc721 = new Contract(token, ERC721_ABI, provider);
  // get token name & symbol
  const [name, symbol] = await Promise.all([
    erc721.name(),
    erc721.symbol()
  ]);

  console.log(`Transferring ${name},${symbol}...`);

  // userOprationを送信する。
  const res = await client.sendUserOperation(
    simpleAccount.execute(
      token,
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

