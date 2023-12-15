import { createContext, useContext, useEffect, useState } from 'react';

import { message } from 'antd';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const INITIAL_STATE = {
  onConnect: '',
  connectors: '',
  isLoading: '',
  errors: '',
  pendingConnector: '',
  isConnected: '',
  activeConnector: '',
  address: '',
  disconnect: '',
};

const WalletContext = createContext(INITIAL_STATE);

export const useWalletContext = () => useContext(WalletContext);

export const WalletContextProvider = ({ children }) => {
  const { connector: activeConnector, isConnected, address } = useAccount();

  const { disconnect } = useDisconnect();

  const { connect, connectors, errors, isLoading, pendingConnector } =
    useConnect({
      onSuccess(data) {
        const adminWalletAddresses = JSON.parse(
          localStorage.getItem('walletAdresses')
        );
        if (adminWalletAddresses.indexOf(data.account) < 0) {
          disconnect();
          setError('WALLET MISSMATCHED');
          message.error('Wallet Is Not Registered In Admin Details Wallet');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          throw 'Wallet missmatched';
        }
      },
    });

  const [error, setError] = useState(errors);

  useEffect(() => {
    const handleConnectorUpdate = ({ account }) => {
      if (account) {
        const adminWalletAddresses = JSON.parse(
          localStorage.getItem('walletAdresses')
        );
        if (adminWalletAddresses.indexOf(account) < 0) {
          disconnect();
          setError('WALLET MISSMATCHED');
          throw 'Wallet missmatched';
        }
      }
    };

    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate);
    }
  }, [activeConnector]);

  return (
    <WalletContext.Provider
      value={{
        onConnect: connect,
        connectors,
        isLoading,
        errors: error,
        pendingConnector,
        isConnected,
        activeConnector,
        address,
        disconnect,
      }}>
      {children}
    </WalletContext.Provider>
  );
};
