'use client';

import React from 'react';
import { sdk } from '@farcaster/frame-sdk';

interface FarcasterButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const FarcasterButton: React.FC<FarcasterButtonProps> = ({
  className = '',
  style = {},
  children = 'Add to Farcaster'
}) => {
  const handleAddToFarcaster = async () => {
    try {
      await sdk.actions.addFrame();
      console.log('Successfully asked user to add MiniTV to Farcaster');
    } catch (error) {
      console.error('Error adding to Farcaster:', error);
    }
  };

  // Sprawdzamy, czy aplikacja działa wewnątrz klienta Farcaster
  const isInFarcaster = typeof window !== 'undefined' && typeof sdk !== 'undefined';

  if (!isInFarcaster) {
    return null; // Nie pokazuj przycisku jeśli nie jesteśmy w klientcie Farcaster
  }

  return (
    <button
      onClick={handleAddToFarcaster}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      style={{
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        ...style
      }}
    >
      {children}
    </button>
  );
};

export default FarcasterButton; 