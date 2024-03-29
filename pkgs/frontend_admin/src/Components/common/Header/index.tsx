import { useContext } from "react";
import CurrentAccountContext from '../../../context/CurrentAccountProvider';
import { shortAddress } from '../../../utils/ethereum';

/**
 * Header Component
 */
const Header = () => {
    const [currentAccount, connectWallet] = useContext(CurrentAccountContext);

    return (
        <div className="w-full">
            <div className="bg-rose-100">
                <nav className="flex justify-between w-full bg-rose-600 text-white p-4">
                    <span className="font-semibold text-xl tracking-tight">Okozukai Valut for admin</span>
                    <div className="flex text-sm" v-else>
                        {(currentAccount !== "" && currentAccount !== undefined)  ?
                            <button
                                className="p-2 ml-2 bg-rose-200 text-gray-900 font-semibold leading-none border border-rose-400 rounded hover:border-transparent hover:bg-rose-200"
                            >
                                {shortAddress(currentAccount)}
                            </button>
                        :
                            <button
                                className="p-2 ml-2 bg-rose-200 text-gray-900 font-semibold leading-none border border-rose-400 rounded hover:border-transparent hover:bg-rose-200"
                                onClick={connectWallet}
                            >
                                Connect
                            </button>
                        }
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;