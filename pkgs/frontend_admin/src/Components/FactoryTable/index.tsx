import { useContext } from "react";
import ContractContext from '../../context/ContractProvider';
import CurrentAccountContent from "./../../context/CurrentAccountProvider";
import { SIMPLE_ACCOUNT_FACTORY_ADDRESS } from "./../../utils/Contents";
import { FactoryCreated } from './../../utils/types';
import TableRow from './TableRow';

interface Props {
    data: { factoryCreateds: FactoryCreated[] };
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
        return (data.factoryCreateds.map((factoryCreated: FactoryCreated) => (
            <TableRow 
                factoryCreated={factoryCreated} 
                setIsLoading={setIsLoading} 
                currentAddress={currentAccount!}
                addStake={addStake}
            />
        )))
    }

    return (
        <>
            {(currentAccount !== "" && currentAccount !== undefined)  ? (
                <>
                    <div className="mb-8">
                        Contract Wallets
                    </div>
                    <table>
                        <thead>
                            <tr >
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Factory ID</th>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Factory Address</th>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Contract Wallet Address</th>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Balance</th>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Deposit</th>
                                <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Action</th>
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
                        className="p-2 ml-2 bg-teal-200 text-gray-900 font-semibold leading-none border border-teal-400 rounded hover:border-transparent hover:bg-teal-200"
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