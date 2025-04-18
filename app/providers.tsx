'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "your-api-key-here"}
      projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_APP_ID || "your-project-id-here"}
      chain={base}
      config={{ 
        appearance: { 
          mode: 'auto',
          name: 'MagicVid',
          logo: '/logo.png'
        }
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}

