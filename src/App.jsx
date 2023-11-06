import { useEffect } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  WagmiConfig,
  configureChains,
  createClient,
  goerli,
  mainnet,
} from 'wagmi';
import { bscTestnet, bsc } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';

import Navbar from './components/navbar';
import { WalletContextProvider } from './context/WalletContext';
import AuthContextProvider from './providers/AuthProviders';
import MainRoutes from './routes';

function App() {
  const loc = window.location.pathname;

  const { chains, provider, webSocketProvider } = configureChains(
    [mainnet, goerli, bscTestnet, bsc],
    [publicProvider()]
  );

  const client = createClient({
    provider,
    webSocketProvider,
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
  });

  const queryClient = new QueryClient();

  useEffect(() => {
    if (loc === '/') window.location.replace('/login');
  }, []);

  return (
    <AuthContextProvider>
      <WagmiConfig client={client}>
        <WalletContextProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/*" element={<MainRoutes />} />
                <Route
                  path="*"
                  element={<div> Not Found or You do not have permission.</div>}
                />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </WalletContextProvider>
      </WagmiConfig>
    </AuthContextProvider>
  );
}

export default App;
