import { shortAddress } from '../../utils/ethereum';
import { CollectionRecord } from "../../utils/types";

type Props = {
  txs: CollectionRecord[];
};

/**
 * TxTable Component
 */
const TxTable = (props: Props) => { 

  const { txs } = props;

  console.log("txs:", txs)

  /**
   * TableRows component
   */
  const tableRows = () => {
    return (txs.map((tx: CollectionRecord) => (
      <tr key={tx.data.id} className="border-b border-slate-300">
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          {shortAddress(tx.data.to)}
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          {tx.data.type}
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          {shortAddress(tx.data.tokenAddr)}
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          {tx.data.amount}
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          {tx.data.date}
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          {tx.data.status}
        </td>
      </tr> 
    )))
  }

  return (
    <>
      <div className="mb-8">
        Txbalance
      </div>
      <table>
        <thead>
          <tr>
            <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>To</th>
            <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Type</th>
            <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Token Address</th>
            <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>amount</th>
            <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Date</th>
            <th className='px-5 py-3 border-b-2 border-gray-200 bg-teal-600 text-center text-xs font-semibold text-white uppercase tracking-wider'>Status</th>
          </tr>
        </thead>
        <tbody>
          {tableRows()}
        </tbody>
      </table>
    </>
  );
}

export default TxTable;