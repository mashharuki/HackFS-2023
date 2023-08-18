import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { MUMBAI_RPC_URL, POLYGONSCAN_URL } from '../../../utils/Contents';
import { WalletCreated } from '../../../utils/types';
import SendModal from '../../common/SendModal';

interface Props {
    walletCreated: WalletCreated;
    setIsLoading: (arg0: boolean) => void;
    currentAddress: string;
}

/**
 * tableRows
 */
const TableRow = (porps: Props) => {
    const [balance, setBalance] = useState('0');

    const walletCreated = porps.walletCreated;
    const setIsLoading = porps.setIsLoading;

    /**
     * get ContractWallet's balance method
     * @param factoryAddress
     */
    const getBalance = async () => {         
        // 残高を取得する。
        const provider = new ethers.providers.JsonRpcProvider(MUMBAI_RPC_URL);
        const getBalancePromise = await provider.getBalance(walletCreated.addr);
        // console.log("balance:", getBalancePromise);
        const formatBalance = Number(ethers.utils.formatEther(getBalancePromise));
        const balance = String(formatBalance.toFixed(3));
        setBalance(balance);
    }

    useEffect(() => { 
        /**
         * 初期化メソッド
         */
        const init = async() => { 
            await getBalance();
        };
        init();
    });

    return (
        <tr key={walletCreated.walletId} className="border-b border-slate-300">
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                {walletCreated.walletId}
            </td>
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm underline underline-offset-4'>
                <a href={POLYGONSCAN_URL + walletCreated.addr}>
                    {walletCreated.addr}
                </a>
            </td>
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                {balance}
            </td>
            <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                <SendModal 
                    address={walletCreated.addr} 
                    setIsLoading={setIsLoading} 
                />
            </td>
        </tr>
    )
}

export default TableRow;