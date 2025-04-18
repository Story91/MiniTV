'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import { useConnect } from 'wagmi';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export function FarcasterFrameProvider({ children }: PropsWithChildren) {
  const { connect } = useConnect();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    let mounted = true;

    const init = async () => {
      try {
        const context = await sdk.context;

        if (!mounted) return;

        // Autoconnect if running in frame
        if (context?.client.clientFid) {
          connect({ connector: farcasterFrame() });
        }

        // Hide splash screen after UI render
        setTimeout(() => {
          if (mounted) {
            sdk.actions.ready();
            console.log('Farcaster Frame SDK initialized and splash screen hidden');
          }
        }, 800);
      } catch (error) {
        console.error('Failed to initialize Farcaster Frame:', error);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [connect, isMounted]);

  if (!isMounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
} 