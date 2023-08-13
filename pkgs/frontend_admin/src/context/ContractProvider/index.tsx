import { createContext, ReactNode } from "react";
import { useContract } from "../../hooks/useContract";

const ContractContext = createContext<[
    (currentAccount: string, factoryAddress: string) => void
]>([
  (currentAccount: string, factoryAddress: string) => {},
]);

/**
 * ContractProvider Comoponent
 * @param param0 
 * @returns 
 */
export const ContractProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { addStake } = useContract();
 
    return (
        <ContractContext.Provider 
            value={[addStake]}
        >
            {children}
        </ContractContext.Provider>
    );
};

export default ContractContext;