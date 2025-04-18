'use client';

import React, { useState, useEffect } from 'react';
import RetroTV from './RetroTV';
import TVInterface from './TVInterface';
import styles from './RetroTVApp.module.css';
import WalletConnect from '../WalletConnect';

// Definicja interfejsu dla typów tematów
interface TVTheme {
  name: string;
  color: string;
}

interface TVThemesType {
  [key: string]: TVTheme;
}

// Dostępne kolory tła
const TV_THEMES: TVThemesType = {
  blue: {
    name: 'BASE BLUE',
    color: '#0052FF'
  },
  yellow: {
    name: 'Retro Yellow',
    color: '#e3a01d'
  },
  green: {
    name: 'Matrix Green',
    color: '#00FF41'
  },
  red: {
    name: 'Classic Red',
    color: '#FF3333'
  },
  purple: {
    name: 'Neon Purple',
    color: '#9B30FF'
  }
};

// Kanały TV
const TV_CHANNELS = [
  'UPLOAD',
  'CUSTOMIZE',
  'GENERATE',
  'WATCH',
  'CONTACT'
];

interface RetroTVAppProps {
  uploadComponent: React.ReactNode;
  customizeComponent: React.ReactNode;
  generateComponent: React.ReactNode;
  videoComponent: React.ReactNode;
}

const RetroTVApp: React.FC<RetroTVAppProps> = ({
  uploadComponent,
  customizeComponent,
  generateComponent,
  videoComponent,
}) => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(true);
  const [staticIntensity, setStaticIntensity] = useState<number>(0.2);
  const [isRemoteOpen, setIsRemoteOpen] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<string>('yellow');
  const [currentChannel, setCurrentChannel] = useState(0);
  const [secretCode, setSecretCode] = useState<number[]>([]);
  const [showHackScreen, setShowHackScreen] = useState(false);
  const [hackMessage, setHackMessage] = useState("HackThisTV");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Tajny kod: 8453
  const correctCode = [8, 4, 5, 3];

  // Funkcja sprawdzająca kod
  const checkSecretCode = (newCode: number[]) => {
    if (newCode.length === 4) {
      if (JSON.stringify(newCode) === JSON.stringify(correctCode)) {
        setShowHackScreen(true);
        setHackMessage("Hack successful! Now you are BASED!");
        
        // Wywołaj globalny event informujący o poprawnym kodzie
        const hackEvent = new CustomEvent('hack-code-successful', {
          detail: { message: 'Hack successful! Now you are BASED!' }
        });
        window.dispatchEvent(hackEvent);
        
        console.log('Secret code correct! Hack successful!');
      } else {
        setSecretCode([]);
      }
    }
  };

  // Funkcja dodająca cyfrę do kodu
  const addDigitToCode = (digit: number) => {
    const newCode = [...secretCode, digit];
    if (newCode.length > 4) {
      newCode.shift(); // Usuń pierwszą cyfrę jeśli kod ma więcej niż 4 cyfry
    }
    setSecretCode(newCode);
    checkSecretCode(newCode);
  };

  const handleTabChange = (tab: string) => {
    if (!isPoweredOn) return;
    
    console.log('Changing tab to:', tab);
    
    // Natychmiastowa aktualizacja aktywnej zakładki
    setActiveTab(tab);
    
    // Efekt wizualny przełączania kanałów
    setStaticIntensity(0.5);
    setTimeout(() => {
      setStaticIntensity(0.2);
    }, 200);

    if (tab === 'upload' || tab === 'customize' || tab === 'generate' || 
        tab === 'watch' || tab === 'contact') {
      setCurrentChannel(TV_CHANNELS.indexOf(tab.toUpperCase()));
    }
  };

  const togglePower = () => {
    setIsPoweredOn(!isPoweredOn);
  };

  const toggleRemote = () => {
    setIsRemoteOpen(!isRemoteOpen);
  };

  const changeTheme = (themeKey: string) => {
    if (TV_THEMES[themeKey]) {
      setCurrentTheme(themeKey);
      
      // Ustaw własny styl dla tła telewizora
      const tvContent = document.querySelector(`.${styles.tvContent}`);
      if (tvContent) {
        (tvContent as HTMLElement).style.backgroundColor = TV_THEMES[themeKey].color;
      }
    }
  };

  const cycleThemes = () => {
    const themeKeys = Object.keys(TV_THEMES);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setCurrentTheme(themeKeys[nextIndex]);
  };

  const renderActiveContent = () => {
    switch(activeTab) {
      case 'upload':
        return uploadComponent;
      case 'customize':
        return customizeComponent;
      case 'generate':
        return generateComponent;
      case 'watch':
        return videoComponent;
      case 'contact':
        return (
          <div className={styles.contactContent}>
            <h2>Contact Us</h2>
            <p>Have questions or feedback? Reach out to us!</p>
            <div className={styles.contactInfo}>
              <p style={{fontSize: '1.1em', marginTop: '15px'}}>
                Built on Base by <a href="https://x.com/Story91_" target="_blank" rel="noopener noreferrer" style={{color: '#fff', textDecoration: 'underline'}}>Story91_</a> with <a href="https://x.com/tryoharaAI" target="_blank" rel="noopener noreferrer" style={{color: '#fff', textDecoration: 'underline'}}>Ohara</a>
              </p>
              
              <div style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: 'rgba(0, 82, 255, 0.2)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 82, 255, 0.5)'
              }}>
                <h3 style={{color: '#0052FF', marginBottom: '10px'}}>Wallet Features</h3>
                <p style={{marginBottom: '10px'}}>
                  Use our advanced wallet interface (draggable button) to:
                </p>
                <ul style={{
                  listStyleType: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  <li style={{marginBottom: '5px'}}>• Send and receive crypto</li>
                  <li style={{marginBottom: '5px'}}>• Swap tokens directly in the app</li>
                  <li style={{marginBottom: '5px'}}>• Check your token portfolio</li>
                  <li style={{marginBottom: '5px'}}>• Buy crypto with fiat</li>
                  <li style={{marginBottom: '5px'}}>• View transaction history</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return uploadComponent;
    }
  };

  const channelUp = () => {
    const nextChannel = (currentChannel + 1) % TV_CHANNELS.length;
    setCurrentChannel(nextChannel);
    handleTabChange(TV_CHANNELS[nextChannel].toLowerCase());
  };

  const channelDown = () => {
    const prevChannel = (currentChannel - 1 + TV_CHANNELS.length) % TV_CHANNELS.length;
    setCurrentChannel(prevChannel);
    handleTabChange(TV_CHANNELS[prevChannel].toLowerCase());
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className={styles.retroAppContainer}>
      <WalletConnect />
      <RetroTV isOn={isPoweredOn} staticIntensity={staticIntensity}>
        <div className={styles.tvApp}>
          {isPoweredOn ? (
            <>
              <div className={styles.tvContent} style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: TV_THEMES[currentTheme].color 
              }}>
                {activeTab === 'main' ? (
                  <TVInterface activeTab={activeTab} onTabChange={handleTabChange} />
                ) : (
                  <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {renderActiveContent()}
                  </div>
                )}
              </div>
              
              {!isMobile && activeTab !== 'main' && (
                <div className={styles.navigationBar} style={{ 
                  position: 'absolute', 
                  bottom: '4px', 
                  left: 0, 
                  right: 0, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '10px',
                  padding: '5px',
                  zIndex: 20
                }}>
                  {['upload', 'customize', 'generate', 'watch', 'contact'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      style={{
                        background: tab === activeTab ? 'rgba(0, 82, 255, 0.8)' : 'rgba(50, 50, 50, 0.6)',
                        border: 'none',
                        padding: '5px 10px',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'Courier New',
                        textTransform: 'uppercase',
                        minWidth: '70px'
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                  <button 
                    onClick={() => handleTabChange('main')}
                    style={{
                      background: 'rgba(0, 82, 255, 0.6)',
                      border: 'none',
                      padding: '5px 10px',
                      color: 'white',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'Courier New',
                      textTransform: 'uppercase',
                      minWidth: '70px'
                    }}
                  >
                    Menu
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.tvOff}>
              <div className={styles.tvOffText}>POWER OFF</div>
            </div>
          )}
        </div>
      </RetroTV>
      
      {/* Przycisk do wysuwania pilota - przywróć dla wszystkich urządzeń */}
      <button 
        className={styles.remoteToggle}
        onClick={toggleRemote}
        style={{
          right: isRemoteOpen ? '280px' : '20px'
        }}
      >
        {isRemoteOpen ? '→' : '←'}
      </button>
      
      {/* Wysuwany pilot TV - przywróć dla wszystkich urządzeń */}
      <div 
        className={`${styles.tvRemote} ${isRemoteOpen ? styles.open : ''}`}
      >
        {/* Analogowy wyświetlacz */}
        <div className={styles.remoteDisplay}>
          <div className={styles.remoteDisplayText}>THEME: {TV_THEMES[currentTheme].name}</div>
          <div className={styles.remoteDisplayText}>STATIC: {Math.round(staticIntensity * 100)}%</div>
          <div className={styles.remoteDisplayChannel}>
            CHANNEL: {currentChannel + 1} - {TV_CHANNELS[currentChannel]}
          </div>
          
          {showHackScreen && (
            <div className={styles.hackScreen}>
              <div className={styles.secretCode}>{hackMessage}</div>
            </div>
          )}
        </div>
        
        {/* Sekcja przycisków zasilania */}
        <div className={styles.remotePowerSection}>
          <button 
            className={styles.remotePowerButton}
            onClick={togglePower}
          >
            POWER
          </button>
          <button 
            className={styles.remoteMuteButton}
          >
            MUTE
          </button>
        </div>
        
        {/* Kolorowe przyciski */}
        <div className={styles.remoteColorButtons}>
          {Object.entries(TV_THEMES).slice(0, 4).map(([key, theme]) => (
            <button 
              key={key}
              onClick={() => changeTheme(key)}
              className={styles.remoteColorButton}
              style={{
                backgroundColor: theme.color,
                border: currentTheme === key ? '3px solid white' : 'none'
              }}
            ></button>
          ))}
        </div>
        
        {/* Przyciski numeryczne */}
        <div className={styles.remoteNumpad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
            <button 
              key={num}
              onClick={() => addDigitToCode(num)}
              className={styles.remoteNumButton}
            >
              {num}
            </button>
          ))}
          <button 
            className={styles.remoteNumButton}
            onClick={cycleThemes}
          >
            THM
          </button>
        </div>
        
        {/* Przyciski sterujące */}
        <div className={styles.remoteControlButtons}>
          <div className={styles.remoteControlRow}>
            <div style={{ width: '50px' }}></div>
            <button 
              className={styles.remoteControlArrow}
              onClick={channelUp}
            >
              ▲
            </button>
            <div style={{ width: '50px' }}></div>
          </div>
          <div className={styles.remoteControlRow}>
            <button 
              className={styles.remoteControlArrow}
              onClick={() => setStaticIntensity(Math.max(0, staticIntensity - 0.1))}
            >
              ◀
            </button>
            <button 
              className={styles.remoteMiddleButton}
              onClick={() => handleTabChange('main')}
            >
              MENU
            </button>
            <button 
              className={styles.remoteControlArrow}
              onClick={() => setStaticIntensity(Math.min(1, staticIntensity + 0.1))}
            >
              ▶
            </button>
          </div>
          <div className={styles.remoteControlRow}>
            <div style={{ width: '50px' }}></div>
            <button 
              className={styles.remoteControlArrow}
              onClick={channelDown}
            >
              ▼
            </button>
            <div style={{ width: '50px' }}></div>
          </div>
        </div>
        
        <div className={styles.remoteFooter}>
          <p className={styles.remoteVersion}>
            MiniTV v1.0 {secretCode.length > 0 ? `*${secretCode.join('')}` : ''}
          </p>
        </div>
      </div>
      
      {isMobile ? (
        // Mobile layout - Power button in bottom area
        <div className={styles.remotePowerContainer}>
          <div 
            className={`${styles.remotePower} ${isPoweredOn ? styles.on : ''}`} 
            onClick={togglePower}
          >
            <div className={styles.powerIcon}>⏻</div>
          </div>
        </div>
      ) : (
        // Original power button placement for desktop
        <div className={styles.remotePowerContainer} style={{ marginTop: '30px' }}>
          <div 
            className={`${styles.remotePower} ${isPoweredOn ? styles.on : ''}`} 
            onClick={togglePower}
          >
            <div className={styles.powerIcon}>⏻</div>
          </div>
        </div>
      )}

      {/* Mobile Footer Menu - zmieniono CONTACT na REMOTE */}
      {isMobile && isPoweredOn && (
        <div className={styles.mobileFooter}>
          {['upload', 'customize', 'generate', 'watch'].map(tab => (
            <button 
              key={tab}
              className={`${styles.mobileFooterButton} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              <span className={styles.mobileFooterIcon}>
                {tab === 'upload' && '📤'}
                {tab === 'customize' && '⚙️'}
                {tab === 'generate' && '🎬'}
                {tab === 'watch' && '📺'}
              </span>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          {/* Dodano przycisk REMOTE zamiast CONTACT */}
          <button 
            className={`${styles.mobileFooterButton} ${isRemoteOpen ? styles.active : ''}`}
            onClick={toggleRemote}
          >
            <span className={styles.mobileFooterIcon}>📱</span>
            Remote
          </button>
        </div>
      )}
    </div>
  );
};

export default RetroTVApp; 