import { sendNotifications } from '@/hooks/usePush';
import { erc20Transfer, getContractAddress } from '@/hooks/useUserOp';
import { DB_COLLECTION_NAME, LINK_TOKEN_ADDRESS } from "@/utils/Contents";
import { getCurrentTime } from '@/utils/date';
import { CLIOpts } from "@/utils/types";
import { usePolybase } from "@polybase/react";
import { useState } from 'react';

/**
 * ER20Transfer Component
 */
const ERC20Transfer = (props:any) => { 
    const [tokenAddress, setTokenAddress] = useState(LINK_TOKEN_ADDRESS);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');

    const polybase = usePolybase();

    const {
        setIsLoading,
        privateKey,
        factoryAddress
    } = props;

    const handleErc20Transfer = async () => {
        const opts: CLIOpts = {
            dryRun: false, // Set to true if you want to perform a dry run
            withPM: false, // Set to true if you want to use a paymaster
        };
    
        try {
            setIsLoading(true);
            // get sender address
            const sender = await getContractAddress(privateKey);
            // set ERC20 token
            await erc20Transfer(
                tokenAddress, 
                address, 
                amount, 
                opts, 
                privateKey,
            ).then(async(res) => {
                const currentTime = getCurrentTime();
                
                // data insert to Polybase DB
                await polybase
                    .collection(DB_COLLECTION_NAME)
                    .create([
                        res,
                        sender, 
                        "ERC20",
                        tokenAddress,
                        address,
                        amount,
                        factoryAddress,
                        "success",
                        currentTime
                    ]); 
                // send notifications
                await sendNotifications(address);
            });
            
            alert('Transfer successful');
            console.log('Transfer successful');
            setIsLoading(false);
        } catch (err) {
            console.error('Transfer failed', err);
            alert('Transfer failed');
            setIsLoading(false);
        }
    };

    return (
        <div className='px-6 py-6 bg-white rounded-md border-b border-gray-200'>
            <h1 className='text-lg mb-4'>Let ERC20 Token transfer!!</h1>
            <input
                className='block'
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="Enter ERC20 Token address"
            />
            <input
                className='block'
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter to address"
            />
            <input
                className='block'
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
            />
            <button
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                onClick={handleErc20Transfer}
            >
                Transfer
            </button>
        </div>
    );
}

export default ERC20Transfer;
