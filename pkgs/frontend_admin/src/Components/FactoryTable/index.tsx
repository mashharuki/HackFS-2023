import { useContext } from "react";
import ContractContext from '../../context/ContractProvider';
import CurrentAccountContent from "./../../context/CurrentAccountProvider";
import { SIMPLE_ACCOUNT_FACTORY_ADDRESS } from "./../../utils/Contents";
import { WalletCreated } from './../../utils/types';
import TableRow from './TableRow';

interface Props {
    data: { createds: WalletCreated[] };
    setIsLoading: (arg0: boolean) => void;
}

/**
 * GraphQLで取得した結果を表形式で出力するためのコンポーネント
 * @param data データ
 */
const FactoryTable = (props:Props) => {

    const { 
        data,
        setIsLoading 
    } = props;
    
    const [currentAccount, connectWallet] = useContext(CurrentAccountContent);
    const [createNewFactory, addStake] = useContext(ContractContext);

    /**
     * tableRows
     */
    const TableRows = () => {
        return (data.createds.map((walletCreated: WalletCreated) => (
            <TableRow 
                walletCreated={walletCreated} 
                setIsLoading={setIsLoading} 
                currentAddress={currentAccount!}
            />
        )))
    }

    return (
        <>
            {(currentAccount !== "" && currentAccount !== undefined)  ? (
                <>
                    <div className="mb-8">
                        Vaults
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-rose-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Wallet ID</th>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-rose-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Contract Wallet Address</th>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-rose-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Balance</th>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-rose-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Deposit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TableRows()}
                        </tbody>
                    </table>
                    <div className="m-4">
                        <button 
                            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                            onClick={() => addStake(currentAccount!, SIMPLE_ACCOUNT_FACTORY_ADDRESS)}
                        >
                            add Stake
                        </button>
                    </div>
                </>
            ) :(
                <div className="mb-8">
                    <button
                        className="p-2 ml-2 bg-rose-200 text-gray-900 font-semibold leading-none border border-rose-400 rounded hover:border-transparent hover:bg-rose-200"
                        onClick={connectWallet}
                    >
                        Please Connect
                    </button>
                </div>
            )}
        </>
    );
}

export default FactoryTable;