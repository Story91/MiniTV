'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { FarcasterFrameProvider } from './components/FarcasterFrameProvider/FarcasterFrameProvider';

// Pobranie zmiennych środowiskowych z fallbackami
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mini-tv.app';
const SPLASH_IMAGE = process.env.NEXT_PUBLIC_FARCASTER_SPLASH_IMAGE || 'https://mini-tv.app/miniicon.png';
const APP_NAME = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'MiniTV';
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '';
const ONCHAIN_API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '';
const ONCHAIN_APP_ID = process.env.NEXT_PUBLIC_ONCHAINKIT_APP_ID || '';

// Konfiguracja wagmi dla obsługi portfela
const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcasterFrame(),
    injected(),
    coinbaseWallet({
      appName: APP_NAME,
      appLogoUrl: SPLASH_IMAGE,
      darkMode: true
    }),
    walletConnect({ 
      projectId: WC_PROJECT_ID,
      metadata: {
        name: APP_NAME,
        description: 'Transform images into amazing videos using AI',
        url: BASE_URL,
        icons: [SPLASH_IMAGE]
      }
    })
  ]
});

// Klient dla React Query (wymagany przez wagmi)
const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <FarcasterFrameProvider>
          <OnchainKitProvider
            apiKey={ONCHAIN_API_KEY}
            projectId={ONCHAIN_APP_ID}
            chain={base}
            config={{ 
              appearance: { 
                mode: 'auto',
                name: APP_NAME,
                logo: SPLASH_IMAGE
              },
              wallet: {
                display: 'modal',
              }
            }}
          >
            {props.children}
          </OnchainKitProvider>
        </FarcasterFrameProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

