'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { FarcasterFrameProvider } from './components/FarcasterFrameProvider/FarcasterFrameProvider';
import { useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

// Pobranie zmiennych środowiskowych z fallbackami
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mini-tv.app';
const SPLASH_IMAGE = process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL || 'https://mini-tv.app/miniicon.png';
const APP_NAME = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'MiniTV';
const ONCHAIN_API_KEY = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '';
const ONCHAIN_APP_ID = process.env.NEXT_PUBLIC_ONCHAINKIT_APP_ID || '';
const ICON_URL = process.env.NEXT_PUBLIC_ICON_URL || 'https://mini-tv.app/miniicon.png';

// Komponent inicjalizujący Farcaster Frame SDK
function FarcasterFrameInitializer() {
  useEffect(() => {
    const initFrameSDK = async () => {
      try {
        // Wywołanie metody ready kiedy interfejs jest gotowy
        // Ukrywa ekran ładowania w aplikacji Farcaster
        await sdk.actions.ready({
          disableNativeGestures: false // Ustaw na true jeśli aplikacja ma konflikty z gestami
        });
        console.log('Farcaster Frame SDK initialized');
      } catch (error) {
        console.error('Failed to initialize Farcaster Frame SDK:', error);
      }
    };

    initFrameSDK();
  }, []);

  return null;
}

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={ONCHAIN_API_KEY}
      projectId={ONCHAIN_APP_ID}
      chain={base}
      config={{ 
        appearance: { 
          mode: 'auto',
          name: APP_NAME,
          logo: ICON_URL
        }
      }}
    >
      <FarcasterFrameProvider>
        {props.children}
      </FarcasterFrameProvider>
    </OnchainKitProvider>
  );
}

