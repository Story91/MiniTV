'use client';

import React, { useState, useEffect } from 'react';
import { WalletIsland } from '@coinbase/onchainkit/wallet';

export default function WalletConnect() {
  const [isMobile, setIsMobile] = useState(false);
  const [initialPosition, setInitialPosition] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 480;
      setIsMobile(mobile);
      
      // Niezależnie od typu urządzenia, zawsze ustawiamy portfel maksymalnie w lewym górnym rogu
      setInitialPosition({ x: 20, y: 20 });
    };
    
    // Sprawdź przy pierwszym renderowaniu
    checkMobile();
    
    // Dodaj nasłuchiwanie zmian rozmiaru okna
    window.addEventListener('resize', checkMobile);
    
    // Posprzątaj event listener przy odmontowaniu komponentu
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dodajemy style bezpośrednio do dokumentu dla dropdown'u
  useEffect(() => {
    // Dodajemy style do głowy dokumentu, aby zwiększyć z-index dla dropdown'u
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      /* Style dla wszystkich elementów WalletIsland i jego dropdown'u */
      .wallet-advanced-container,
      .wallet-advanced-dropdown,
      [data-rbsg-wallet-advanced-dropdown-container],
      [data-rbsg-wallet-advanced-dropdown],
      div[role="dialog"],
      [data-wallet-island],
      [data-wallet-island-dropdown],
      [data-wallet-island-container],
      .wallet-island-dropdown,
      .wallet-container [role="dialog"],
      .wallet-container .dropdown-menu,
      .wallet-container .modal,
      .wallet-container .popup,
      .wallet-container [class*="dropdown"],
      .wallet-container [class*="menu"],
      .wallet-container [class*="portal"],
      .wallet-container [class*="dialog"] {
        z-index: 99999 !important;
        position: fixed !important;
      }
      
      /* Zapobiegamy zasłanianiu przez footer */
      .wallet-container * {
        position: relative;
      }
      
      /* Korygujemy pozycje dla dropdown'u - wyświetlamy poniżej portfela */
      .wallet-container [role="dialog"],
      .wallet-container .dropdown-menu {
        top: 70px !important;
        left: 10px !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
        transform-origin: top left !important;
      }
      
      /* Style specyficzne dla urządzeń mobilnych */
      @media (max-width: 480px) {
        .wallet-container [role="dialog"],
        .wallet-container .dropdown-menu,
        .wallet-container [class*="dropdown"],
        .wallet-container [class*="menu"] {
          max-height: 70vh !important;
          top: 70px !important;
          left: 10px !important;
          width: 90% !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [isMobile]);

  // Dodajmy style dla kontenera WalletIsland, aby lepiej pasował do RetroTV
  const walletStyles = {
    zIndex: 99999, // Znacznie zwiększamy z-index, aby być zawsze na wierzchu
    position: 'fixed' as const, // 'fixed' zamiast 'absolute' aby zawsze był widoczny
    pointerEvents: 'none' as const, // żeby kontener nie blokował interakcji z przyciskiem
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  };

  // Style dla samego przycisku
  const buttonStyles = {
    pointerEvents: 'auto' as const, // przywracamy interakcje dla przycisku
  };

  return (
    <div style={walletStyles} className="wallet-container">
      <div style={buttonStyles}>
        <WalletIsland 
          startingPosition={initialPosition}
        />
      </div>
    </div>
  );
} 