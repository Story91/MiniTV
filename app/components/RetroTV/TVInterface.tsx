'use client';

import React, { useState } from 'react';
import styles from './TVInterface.module.css';

interface TVInterfaceProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TVInterface: React.FC<TVInterfaceProps> = ({ activeTab, onTabChange }) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const menuItems = [
    { id: 'upload', label: 'UPLOAD' },
    { id: 'customize', label: 'CUSTOMIZE' },
    { id: 'generate', label: 'GENERATE' },
    { id: 'watch', label: 'WATCH' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <div className={styles.tvInterface} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.tvHeader}>
        <div className={styles.tvLogo}>
          <h1>Mini<span>TV</span></h1>
        </div>
        <div className={styles.tvSubtitle}>
          Image to Video <span style={{color: '#0052FF', fontWeight: 'bold'}}>AI</span> Generator
        </div>
      </div>

      <div className={styles.tvMenuContainer} style={{ flex: 1 }}>
        <div className={styles.tvMenu}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.tvButton} ${activeTab === item.id ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked:', item.id);
                onTabChange(item.id);
              }}
              onMouseEnter={() => setHoveredButton(item.id)}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                padding: '15px 20px',
                margin: '10px 0',
                width: '100%',
                textAlign: 'left',
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '5px',
                background: 'transparent',
                border: activeTab === item.id ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                fontFamily: 'Courier New, monospace',
                fontSize: '1.2rem',
                letterSpacing: '2px'
              }}
            >
              <div className={styles.buttonInner}>
                <span className={styles.buttonIcon} style={{ color: activeTab === item.id ? '#ff3333' : 'inherit' }}>
                  {activeTab === item.id ? '●' : '○'}
                </span>
                <span className={styles.buttonText}>{item.label}</span>
              </div>
              {(activeTab === item.id || hoveredButton === item.id) && (
                <div className={styles.tvButtonGlow}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tvFooter}>
        <div className={styles.tvInstructions}>
          CLICK CHANNEL BUTTONS TO NAVIGATE
        </div>
        <div className={styles.tvChannel}>
          MiniTV v1.0
        </div>
      </div>
    </div>
  );
};

export default TVInterface; 