import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { config } from './wagmi.jsx';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Fix the query client initialization
let queryClient = null;

const getQueryClient = () => {
  if (!queryClient) {
    queryClient = new QueryClient();
  }
  return queryClient;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={getQueryClient()}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);