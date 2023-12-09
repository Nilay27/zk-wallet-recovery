import React, { createContext, useState, useEffect } from 'react';
import { connectWallet, getCurrentAccount, setupEthereumEventListeners, getEthereumObject } from '../utils/ethereum'; // Import functions from ethereum.js
import { use } from 'chai';

export const WalletConnectContext = createContext();

export const WalletConnectProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const ethereum = getEthereumObject();
      if (!ethereum) return;

      await connectWallet();
      const currentAccount = await getCurrentAccount();
      setAccount(currentAccount);

      setupEthereumEventListeners(ethereum);
    };

    initialize();
  }, []);


  return (
    <WalletConnectContext.Provider value={{ account }}>
      {children}
    </WalletConnectContext.Provider>
  );
};
