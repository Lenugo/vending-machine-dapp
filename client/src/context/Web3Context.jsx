import { createContext, useContext, useState } from 'react';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);

  return (
    <Web3Context.Provider value={{
      account,
      setAccount,
      contract,
      setContract,
      web3,
      setWeb3
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
