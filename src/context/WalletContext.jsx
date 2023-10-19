import { createContext, useContext, useEffect, useState } from 'react';

import { message } from 'antd';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import cmsAPI from '@/api/cms';

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
    const handleConnectorUpdate = ({ account, chain }) => {
      if (account) {
        const adminWalletAddresses = JSON.parse(
          localStorage.getItem('walletAdresses')
        );
        if (adminWalletAddresses.indexOf(account) < 0) {
          disconnect();
          setError('WALLET MISSMATCHED');
          throw 'Wallet missmatched';
        } else {
          console.log(connectors);
        }
      } else if (chain) {
        console.log('new chain', chain);
      }
    };

    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate);
    }

    // return () => activeConnector.off('change', handleConnectorUpdate);
  }, [activeConnector]);

  useEffect(() => {
    const getDetailUser = async () => {
      try {
        const {
          data: { data },
        } = await cmsAPI.getDetailAdmin(3); // hardcoded
        localStorage.setItem(
          'walletAdresses',
          JSON.stringify(data.walletAddresses)
        );
      } catch (error) {
        console.log(error, 'err');
      }
    };
    getDetailUser();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        // provider: web3Service,
        // address: listAccount,
        // isError: errors,
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
