'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

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
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "your-api-key-here"}
      projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_APP_ID || "your-project-id-here"}
      chain={base}
      config={{ 
        appearance: { 
          mode: 'auto',
          name: 'MiniTV',
          logo: '/miniicon.png'
        }
      }}
    >
      <FarcasterFrameInitializer />
      {props.children}
    </OnchainKitProvider>
  );
}

