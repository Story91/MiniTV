'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { base } from 'wagmi/chains';
import styles from './TVComponents.module.css';
import { 
  Transaction, 
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionToast,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionToastAction,
  type LifecycleStatus
} from '@coinbase/onchainkit/transaction';

// Custom hook do wykrywania urządzeń mobilnych
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Ten kod wykona się tylko po stronie klienta
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    // Sprawdź przy pierwszym załadowaniu
    checkMobile();
    
    // Nasłuchuj zmiany rozmiaru okna
    window.addEventListener('resize', checkMobile);
    
    // Posprzątaj przy odmontowaniu komponentu
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}

// Upload Component
export const TVUploadForm: React.FC<{
  selectedFile: File | null;
  previewUrl: string;
  isLoading: boolean;
  uploadProgress: string;
  error: string;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: (event: React.FormEvent) => void;
  resetForm: () => void;
}> = ({
  selectedFile,
  previewUrl,
  isLoading,
  uploadProgress,
  error,
  handleFileSelect,
  handleUpload,
  resetForm,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={styles.tvComponentContainer} style={{ padding: isMobile ? '15px' : '20px', height: '100%' }}>
      <h2 className={styles.tvSectionTitle} style={{ marginBottom: isMobile ? '20px' : '30px', fontSize: isMobile ? '1.4rem' : '1.8rem' }}>UPLOAD IMAGE</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.tvLabel} style={{ 
          fontSize: isMobile ? '0.6rem' : '1.2rem', 
          marginBottom: isMobile ? '5px' : '10px',
          letterSpacing: isMobile ? '0.5px' : 'inherit',
          opacity: isMobile ? 0.9 : 0.8,
          fontWeight: isMobile ? 'normal' : 'inherit'
        }}>
          SELECT IMAGE (MAX 32MB)
        </label>
        <div 
          style={{ 
            border: '2px solid rgba(255,255,255,0.6)', 
            padding: isMobile ? '8px' : '15px', 
            marginBottom: isMobile ? '15px' : '20px',
            borderRadius: '5px',
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.tvFileInput}
            style={{
              display: 'block',
              width: '100%',
              color: 'white',
              padding: isMobile ? '5px' : '10px',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              position: 'relative',
              zIndex: 10,
              fontSize: isMobile ? '0.8rem' : '1.1rem'
            }}
          />
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: isMobile ? 'center' : 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center', 
            marginTop: isMobile ? '6px' : '10px',
            gap: isMobile ? '10px' : '0'
          }}>
            <small style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: isMobile ? '0.7rem' : '0.9rem',
              marginBottom: isMobile ? '5px' : '0',
              width: isMobile ? '100%' : 'auto'
            }}>
              Click to browse your files (JPG, PNG, GIF)
            </small>
            <button
              type="button"
              onClick={resetForm}
              className={styles.tvButtonSecondary}
              style={{
                padding: isMobile ? '5px 10px' : '8px 15px',
                backgroundColor: 'rgba(255,80,80,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 10,
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                alignSelf: isMobile ? 'flex-end' : 'auto',
                marginLeft: isMobile ? 'auto' : '0'
              }}
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {uploadProgress && (
        <p className={styles.tvProgress} style={{ 
          marginBottom: isMobile ? '15px' : '20px', 
          fontSize: isMobile ? '0.9rem' : '1.1rem', 
          backgroundColor: 'rgba(0,0,0,0.3)', 
          padding: isMobile ? '8px 10px' : '10px 15px', 
          borderRadius: '5px', 
          color: '#4caf50',
          textAlign: 'center'
        }}>
          {uploadProgress}
        </p>
      )}

      {previewUrl && (
        <div className={styles.previewContainer} style={{ 
          marginBottom: isMobile ? '100px' : '40px' 
        }}>
          <h3 className={styles.tvSubTitle} style={{ 
            fontSize: isMobile ? '1.1rem' : '1.3rem', 
            marginBottom: '15px' 
          }}>Preview</h3>
          <div className={styles.previewImageContainer}>
            <img
              src={previewUrl}
              alt="Preview"
              className={styles.previewImage}
              style={{ 
                maxHeight: isMobile ? '200px' : '300px',
                border: '3px solid rgba(255,255,255,0.5)' 
              }}
            />
          </div>
          
          <div style={{ 
            marginTop: '40px', 
            borderTop: '2px solid rgba(255,255,255,0.3)', 
            paddingTop: '20px',
            marginBottom: isMobile ? '90px' : '140px'
          }}>
            <p style={{ 
              color: 'white', 
              textAlign: 'center', 
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              textShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
            }}>
              Now go to CUSTOMIZE tab to enhance your image and create an amazing video!
            </p>
            <div style={{ 
              marginTop: '30px',
              borderTop: '2px solid rgba(255,255,255,0.3)',
              paddingTop: '10px'
            }}></div>
          </div>
        </div>
      )}

      {error && (
        <p className={styles.tvError} style={{ marginTop: '20px', fontSize: '1.1rem' }}>{error}</p>
      )}
    </div>
  );
};

// Customize Component
export const TVCustomizeForm: React.FC<{
  imgbbResponse: any;
  promptText: string;
  videoDuration: number;
  guidanceScale: number;
  motionBucketId: number;
  seed: number;
  setPromptText: (text: string) => void;
  setVideoDuration: (duration: number) => void;
  setGuidanceScale: (scale: number) => void;
  setMotionBucketId: (id: number) => void;
  setSeed: (seed: number) => void;
  model: string;
  setModel: (model: string) => void;
  ratio: string;
  setRatio: (ratio: string) => void;
}> = ({
  imgbbResponse,
  promptText,
  videoDuration,
  guidanceScale,
  motionBucketId,
  seed,
  setPromptText,
  setVideoDuration,
  setGuidanceScale,
  setMotionBucketId,
  setSeed,
  model,
  setModel,
  ratio,
  setRatio
}) => {
  const isMobile = useIsMobile();
  
  if (!imgbbResponse || !imgbbResponse.success) {
    return (
      <div className={styles.tvComponentContainer}>
        <h2 className={styles.tvSectionTitle}>CUSTOMIZE VIDEO</h2>
        <p className={styles.tvInfo}>Please upload an image first</p>
      </div>
    );
  }

  // Lista dostępnych proporcji dla wybranego modelu
  const ratioOptions = model === 'gen4_turbo' 
    ? ['1280:720', '720:1280', '1104:832', '832:1104', '960:960', '1584:672'] 
    : ['1280:768', '768:1280'];

  // Lista opisów dla motion intensity
  const getMotionIntensityLabel = (value: number): string => {
    if (value <= 50) return "Low";
    if (value <= 150) return "Medium";
    if (value <= 200) return "High";
    return "Very High";
  };

  return (
    <div className={styles.tvComponentContainer}>
      <h2 className={styles.tvSectionTitle}>CUSTOMIZE VIDEO</h2>
      <div className={styles.tvForm}>
        <div className={styles.formGroup}>
          <label className={styles.tvLabel}>
            Image URL (for Runway)
          </label>
          <input
            type="text"
            value={imgbbResponse.data.display_url}
            readOnly
            className={styles.tvTextInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.tvLabel}>
            Prompt Text
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Enter a description for your video..."
            className={styles.tvTextarea}
            rows={3}
          />
        </div>

        {/* Kontenery flex dostosowane do widoku mobilnego */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '15px' : '20px',
          marginBottom: '20px'
        }}>
          {/* Wybór modelu AI - pierwszy blok */}
          <div className={styles.formGroup} style={{ 
            flex: 1, 
            backgroundColor: '#2a3052', 
            padding: '15px', 
            borderRadius: '8px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <label className={styles.tvLabel} style={{ color: '#e6e600' }}>
              AI Model
            </label>
            <select 
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                // Resetuj proporcje jeśli nie są dostępne dla nowego modelu
                if (!ratioOptions.includes(ratio)) {
                  setRatio(ratioOptions[0]);
                }
              }}
              className={styles.tvSelect}
              style={{ 
                borderColor: '#e6e600', 
                backgroundColor: '#1a1f40',
                width: '100%',
                height: '40px'
              }}
            >
              <option value="gen4_turbo">GEN 4 TURBO (Latest)</option>
              <option value="gen3a_turbo">GEN 3A TURBO</option>
            </select>
            <p className={styles.tvInputNote}>Select AI model for video generation</p>
          </div>

          {/* Wybór proporcji - drugi blok */}
          <div className={styles.formGroup} style={{ 
            flex: 1, 
            backgroundColor: '#503030', 
            padding: '15px', 
            borderRadius: '8px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <label className={styles.tvLabel} style={{ color: '#ff9966' }}>
              Video Ratio
            </label>
            <select 
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className={styles.tvSelect}
              style={{ 
                borderColor: '#ff9966', 
                backgroundColor: '#402020',
                width: '100%',
                height: '40px'
              }}
            >
              {ratioOptions.map(option => (
                <option key={option} value={option}>
                  {option === '1280:720' ? 'Landscape (1280:720)' : 
                   option === '720:1280' ? 'Portrait (720:1280)' :
                   option === '1104:832' ? 'Landscape+ (1104:832)' :
                   option === '832:1104' ? 'Portrait+ (832:1104)' :
                   option === '960:960' ? 'Square (960:960)' :
                   option === '1584:672' ? 'Widescreen (1584:672)' :
                   option === '1280:768' ? 'Landscape 3A (1280:768)' :
                   option === '768:1280' ? 'Portrait 3A (768:1280)' : option}
                </option>
              ))}
            </select>
            <p className={styles.tvInputNote}>Select video aspect ratio</p>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '15px' : '20px',
          marginBottom: '20px'
        }}>
          {/* Duration - pierwszy blok drugiego rzędu */}
          <div className={styles.formGroup} style={{ 
            flex: 1, 
            backgroundColor: '#305030', 
            padding: '15px', 
            borderRadius: '8px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <label className={styles.tvLabel} style={{ color: '#99ff99' }}>
              Video Duration (seconds)
            </label>
            <select
              value={videoDuration.toString()}
              onChange={(e) => setVideoDuration(Number(e.target.value))}
              className={styles.tvSelect}
              style={{ 
                borderColor: '#99ff99', 
                backgroundColor: '#204020',
                width: '100%',
                height: '40px'
              }}
            >
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
            </select>
            <p className={styles.tvInputNote}>Available durations: 5 or 10 seconds</p>
          </div>

          {/* Guidance Scale - drugi blok drugiego rzędu */}
          <div className={styles.formGroup} style={{ 
            flex: 1, 
            backgroundColor: '#30305a', 
            padding: '15px', 
            borderRadius: '8px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <label className={styles.tvLabel} style={{ color: '#99ccff' }}>
              Guidance Scale ({guidanceScale.toFixed(1)})
            </label>
            <div style={{ position: 'relative', width: '100%', height: '20px', marginTop: '10px', marginBottom: '20px' }}>
              <div style={{ 
                position: 'absolute', 
                left: 0, 
                right: 0, 
                height: '8px', 
                backgroundColor: '#1a1f40', 
                borderRadius: '4px',
                border: '1px solid #444',
                top: '50%',
                transform: 'translateY(-50%)'
              }}></div>
              <div style={{ 
                position: 'absolute', 
                left: 0, 
                width: `${((guidanceScale - 1) / 19) * 100}%`, 
                height: '8px', 
                backgroundColor: '#99ccff', 
                borderRadius: '4px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}></div>
              <input
                type="range"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(Number(e.target.value))}
                min={1}
                max={20}
                step={0.1}
                className={styles.tvRangeInput}
                style={{ 
                  width: '100%',
                  accentColor: '#99ccff',
                  height: '40px',
                  position: 'absolute',
                  margin: 0,
                  top: 0,
                  left: 0,
                  opacity: 0.0001, /* Niemal przezroczysty do obsługi kliknięć */
                  cursor: 'pointer',
                  zIndex: 10
                }}
              />
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: `${((guidanceScale - 1) / 19) * 100}%`, 
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                backgroundColor: '#ff6666',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 0 5px rgba(0,0,0,0.5)',
                pointerEvents: 'none'
              }}></div>
            </div>
            <p className={styles.tvInputNote}>Controls creativity (default: 12.5)</p>
          </div>
        </div>

        {/* Motion Intensity - full width bottom */}
        <div className={styles.formGroup} style={{ 
          backgroundColor: '#5a3030', 
          padding: '15px', 
          borderRadius: '8px',
          width: '100%'
        }}>
          <label className={styles.tvLabel} style={{ color: '#ff6666' }}>
            Motion Intensity ({getMotionIntensityLabel(motionBucketId)})
          </label>
          <div style={{ position: 'relative', width: '100%', height: '20px', marginTop: '10px', marginBottom: '20px' }}>
            <div style={{ 
              position: 'absolute', 
              left: 0, 
              right: 0, 
              height: '8px', 
              backgroundColor: '#3a1010', 
              borderRadius: '4px',
              border: '1px solid #444',
              top: '50%',
              transform: 'translateY(-50%)'
            }}></div>
            <div style={{ 
              position: 'absolute', 
              left: 0, 
              width: `${(motionBucketId / 255) * 100}%`, 
              height: '8px', 
              backgroundColor: '#ff6666', 
              borderRadius: '4px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}></div>
            <input
              type="range"
              value={motionBucketId}
              onChange={(e) => setMotionBucketId(Number(e.target.value))}
              min={1}
              max={255}
              className={styles.tvRangeInput}
              style={{ 
                width: '100%',
                accentColor: '#ff6666',
                height: '40px',
                position: 'absolute',
                margin: 0,
                top: 0,
                left: 0,
                opacity: 0.0001, /* Niemal przezroczysty do obsługi kliknięć */
                cursor: 'pointer',
                zIndex: 10
              }}
            />
            <div style={{ 
              position: 'absolute',
              top: '50%',
              left: `${(motionBucketId / 255) * 100}%`, 
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              backgroundColor: '#ff6666',
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 0 5px rgba(0,0,0,0.5)',
              pointerEvents: 'none'
            }}></div>
          </div>
          <p className={styles.tvInputNote}>Controls motion intensity (1-255)</p>
        </div>
        
        {/* Instrukcja dla użytkownika - teraz jako oddzielny element pod Motion Intensity */}
        <div style={{ 
          marginTop: '25px', 
          textAlign: 'center',
          padding: '10px',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          border: '1px dashed rgba(255,255,255,0.3)'
        }}>
          <p style={{ 
            color: '#ffcc00', 
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            fontWeight: 'bold',
            textShadow: '0 0 5px rgba(0,0,0,0.5)'
          }}>
            After adjusting all settings, click GENERATE button to create your video!
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginTop: '10px' 
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px' }}>
              <path d="M7 10L12 15L17 10" stroke="#ffcc00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: '#ff6666', fontWeight: 'bold' }}>GENERATE</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '10px' }}>
              <path d="M17 10L12 15L7 10" stroke="#ffcc00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generate Component
export const TVGenerateComponent: React.FC<{
  imgbbResponse: any;
  isGeneratingVideo: boolean;
  generationProgress: number;
  generationLogs: string[];
  handleGenerateVideo: () => void;
  generationStatus: string;
  taskId: string;
  model?: string;
  ratio?: string;
  videoDuration?: number;
  guidanceScale?: number;
  motionBucketId?: number;
  promptText?: string;
}> = ({
  imgbbResponse,
  isGeneratingVideo,
  generationProgress,
  generationLogs,
  handleGenerateVideo,
  generationStatus,
  taskId,
  model = 'gen4_turbo',
  ratio = '1280:720',
  videoDuration = 5,
  guidanceScale = 12.5,
  motionBucketId = 127,
  promptText = ''
}) => {
  const isMobile = useIsMobile();
  
  // Nowy stan do śledzenia statusu zadania
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Funkcja obsługująca inicjowanie generowania wideo asynchronicznie
  const handleStartVideoGeneration = async () => {
    try {
      // Wywołaj pierwotną funkcję dostarczoną przez props
      handleGenerateVideo();
      
      // Zatrzymaj poprzednie intervalsy jeśli istnieją
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    } catch (error) {
      console.error('Error starting video generation:', error);
    }
  };
  
  // Efekt do obsługi odpytywania statusu zadania
  useEffect(() => {
    // Jeśli mamy taskId i trwa generowanie, ustaw interval do odpytywania statusu
    if (taskId && isGeneratingVideo) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/task-status/${taskId}`);
          const data = await response.json();
          
          // Tutaj możemy aktualizować dane w komponencie nadrzędnym
          // Uwaga: Komponenty nadrzędne powinny dostarczyć funkcje do aktualizacji stanu
          
          // Zakończ odpytywanie, gdy zadanie jest zakończone
          if (data.status === 'SUCCEEDED' || data.status === 'FAILED') {
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
          }
        } catch (error) {
          console.error('Error fetching task status:', error);
        }
      }, 5000); // Odpytuj co 5 sekund
      
      setPollingInterval(interval);
      
      // Zatrzymaj interval przy odmontowaniu lub zmianie taskId
      return () => {
        clearInterval(interval);
      };
    }
    
    // Zatrzymaj odpytywanie, gdy generowanie jest zatrzymane
    if (!isGeneratingVideo && pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [taskId, isGeneratingVideo, pollingInterval]);
  
  if (!imgbbResponse || !imgbbResponse.success) {
    return (
      <div className={styles.tvComponentContainer}>
        <h2 className={styles.tvSectionTitle}>GENERATE VIDEO</h2>
        <p className={styles.tvInfo}>Please upload an image first</p>
      </div>
    );
  }

  // Sprawdź, czy generowanie zostało zakończone pomyślnie
  const isGenerationCompleted = !isGeneratingVideo && generationProgress === 100 && generationStatus === 'SUCCEEDED';
  
  // Funkcja pomocnicza do opisania intensywności ruchu
  const getMotionIntensityLabel = (value: number): string => {
    if (value <= 50) return "Low";
    if (value <= 150) return "Medium";
    if (value <= 200) return "High";
    return "Very High";
  };

  return (
    <div className={styles.tvComponentContainer}>
      <h2 className={styles.tvSectionTitle}>GENERATE VIDEO</h2>
      
      {/* Podsumowanie wybranych parametrów przed generowaniem */}
      {!isGeneratingVideo && !isGenerationCompleted && (
        <div className={styles.parametersSummary}>
          <h3 className={styles.parametersSummaryTitle} style={{ 
            fontSize: isMobile ? '0.7rem' : '0.8rem', 
            textAlign: 'left', 
            display: 'inline-block', 
            marginBottom: 0, 
            paddingBottom: 0,
            marginRight: '10px',
            borderBottom: 'none'
          }}>
            Parameters:
          </h3>
          <div className={styles.parametersGrid}>
            <div className={styles.parameterItem}>
              <span className={styles.parameterLabel}>Model:</span>
              <span className={styles.parameterValue}>{model}</span>
            </div>
            <div className={styles.parameterItem}>
              <span className={styles.parameterLabel}>Ratio:</span>
              <span className={styles.parameterValue}>{ratio}</span>
            </div>
            <div className={styles.parameterItem}>
              <span className={styles.parameterLabel}>Dur:</span>
              <span className={styles.parameterValue}>{videoDuration}s</span>
            </div>
            <div className={styles.parameterItem}>
              <span className={styles.parameterLabel}>Guide:</span>
              <span className={styles.parameterValue}>{guidanceScale}</span>
            </div>
            <div className={styles.parameterItem}>
              <span className={styles.parameterLabel}>Motion:</span>
              <span className={styles.parameterValue}>{getMotionIntensityLabel(motionBucketId)}</span>
            </div>
          </div>
          
          {/* Wyświetlaj prompt w oddzielnym wierszu jeśli istnieje */}
          {promptText && (
            <div style={{ 
              marginTop: isMobile ? '3px' : '8px', 
              background: 'rgba(0,0,0,0.3)', 
              padding: isMobile ? '3px' : '5px', 
              borderRadius: '4px',
              fontSize: isMobile ? '0.6rem' : 'inherit'
            }}>
              <span className={styles.parameterLabel} style={{ marginRight: '5px' }}>
                {isMobile ? 'Prompt:' : 'Prompt:'}
              </span>
              <span className={styles.parameterValue} style={{ 
                wordBreak: 'break-word',
                fontSize: isMobile ? '0.65rem' : 'inherit',
                display: 'inline-block'
              }}>
                "{promptText.length > 60 && isMobile ? promptText.substring(0, 60) + '...' : promptText}"
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.tvForm}>
        <button
          onClick={handleStartVideoGeneration}
          disabled={isGeneratingVideo}
          className={`${styles.tvButton} ${styles.generateButton} ${isGeneratingVideo ? styles.disabled : ''}`}
          style={{ marginTop: isMobile ? '8px' : 'inherit', padding: isMobile ? '10px' : 'inherit' }}
        >
          {isGeneratingVideo ? 'GENERATING VIDEO...' : 'GENERATE VIDEO'}
        </button>

        {isGeneratingVideo && (
          <div className={styles.generationStatus}>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Status:</span>
              <span className={styles.statusValue}>{generationStatus}</span>
            </div>
            
            {taskId && (
              <div className={styles.taskInfo}>
                <span className={styles.taskIdLabel}>Task ID:</span>
                <span className={styles.taskIdValue}>{taskId}</span>
              </div>
            )}

            <div className={styles.progressBar}>
              <div 
                className={styles.progressBarFill}
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            <p className={styles.progressText}>
              {generationProgress}% Complete
            </p>
            <div className={styles.generationLogs}>
              {generationLogs.map((log, index) => (
                <p key={index} className={styles.logEntry}>
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Komunikat o zakończeniu generowania */}
        {isGenerationCompleted && (
          <div className={styles.generationSuccess}>
            <p className={styles.successMessage}>
              <span className={styles.checkmark}>✓</span> Video generated successfully!
            </p>
            <div className={styles.watchInstructions}>
              <p>Your video is ready to watch!</p>
              <p className={styles.watchNotice}>Click the <span className={styles.highlight}>WATCH</span> tab to view and download your video.</p>
              <div className={styles.watchArrow}>
                <span>→</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Video Component
export const TVVideoComponent: React.FC<{
  videoUrl: string;
  handleDownload: () => void;
}> = ({
  videoUrl,
  handleDownload,
}) => {
  const isMobile = useIsMobile();
  const { isConnected } = useAccount();
  const [transactionSuccessful, setTransactionSuccessful] = useState(false);
  const [hackUnlocked, setHackUnlocked] = useState(false);
  const [secretCodeInput, setSecretCodeInput] = useState<number[]>([]);
  const [hackMessage, setHackMessage] = useState("🔓 Hack successful! Now you are BASED!");
  
  // Tajny kod do odblokowania funkcji pobierania bez transakcji
  const correctHackCode = [8, 4, 5, 3];
  
  // Funkcja sprawdzająca kod hackerski
  const checkHackCode = (newCode: number[]) => {
    if (newCode.length === 4) {
      if (JSON.stringify(newCode) === JSON.stringify(correctHackCode)) {
        console.log("Hack code correct! Unlocking download...");
        setHackUnlocked(true);
        setHackMessage("🔓 Hack successful! Now you are BASED!");
      } else {
        setSecretCodeInput([]);
      }
    }
  };
  
  // Nasłuchiwanie na kod wprowadzony z pilota
  useEffect(() => {
    const handleHackFromRemote = (event: CustomEvent) => {
      console.log("Hack event received from remote control!", event.detail);
      setHackUnlocked(true);
      if (event.detail && event.detail.message) {
        setHackMessage(event.detail.message);
      }
    };
    
    window.addEventListener('hack-code-successful', handleHackFromRemote as EventListener);
    
    return () => {
      window.removeEventListener('hack-code-successful', handleHackFromRemote as EventListener);
    };
  }, []);
  
  // Obsługa naciśnięcia klawisza numerycznego
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (/^[0-9]$/.test(key)) {
        const digit = parseInt(key, 10);
        const newCode = [...secretCodeInput, digit];
        if (newCode.length > 4) {
          newCode.shift();
        }
        setSecretCodeInput(newCode);
        checkHackCode(newCode);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [secretCodeInput]);
  
  // Przykładowe wywołanie transakcji zgodne z dokumentacją
  const calls = [
    {
      to: '0xF1fa20027b6202bc18e4454149C85CB01dC91Dfd' as `0x${string}`, // Adres portfela odbiorcy
      value: BigInt(100000000000000), // 0.0001 ETH
      data: '0x' as `0x${string}`
    }
  ];
  
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    // Logujemy szczegółowo status, aby wiedzieć jakie wartości przychodzą
    console.log('Transaction status received:', status);
    
    // Zgodnie z dokumentacją OnchainKit, sprawdzamy czy statusName to 'success'
    if (status.statusName === 'success') {
      console.log('Transaction successful, setting state to unlock download button');
      setTransactionSuccessful(true);
    }
  }, []);
  
  // Dodajemy efekt, który będzie monitorował stan przycisku
  useEffect(() => {
    console.log('Current transaction successful state:', transactionSuccessful);
  }, [transactionSuccessful]);
  
  if (!videoUrl) {
    return (
      <div className={styles.tvComponentContainer}>
        <h2 className={styles.tvSectionTitle}>WATCH VIDEO</h2>
        <p className={styles.tvInfo}>No video generated yet. Generate a video first.</p>
      </div>
    );
  }

  // Sprawdź czy wideo jest odblokowane przez transakcję lub kod hackerski
  const isVideoUnlocked = transactionSuccessful || hackUnlocked;

  return (
    <div className={styles.tvComponentContainer}>
      <h2 className={styles.tvSectionTitle}>WATCH VIDEO</h2>
      <div className={styles.videoContainer}>
        <video
          controls
          className={styles.tvVideo}
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>

        <div className={styles.videoControls}>
          <button
            onClick={handleDownload}
            className={styles.tvButton}
            disabled={!isVideoUnlocked}
            style={{
              opacity: !isVideoUnlocked ? 0.5 : 1,
              cursor: !isVideoUnlocked ? 'not-allowed' : 'pointer',
              width: '100%',
              padding: '10px 15px',
              fontSize: '1rem',
              marginBottom: '10px'
            }}
          >
            DOWNLOAD VIDEO
          </button>
          
          {isConnected && !isVideoUnlocked && (
            <div style={{ marginTop: '20px', width: '100%' }}>
              {/* Implementacja zgodna z dokumentacją */}
              <Transaction
                chainId={base.id}
                calls={calls}
                onStatus={handleOnStatus}
              >
                <div className={styles.transactionButtonContainer} style={{ width: '100%' }}>
                  <TransactionButton />
                </div>
                <TransactionSponsor />
                <TransactionStatus>
                  <TransactionStatusLabel />
                  <TransactionStatusAction />
                </TransactionStatus>
                <TransactionToast>
                  <TransactionToastIcon />
                  <TransactionToastLabel />
                  <TransactionToastAction />
                </TransactionToast>
              </Transaction>
              
              <div style={{ 
                padding: '10px', 
                backgroundColor: 'rgba(0,0,0,0.2)', 
                borderRadius: '5px', 
                marginTop: '10px'
              }}>
                <p className={styles.tvInfo} style={{ 
                  color: '#ffcc00', 
                  textAlign: 'center', 
                  fontSize: '0.9rem',
                  margin: 0
                }}>
                  Complete transaction to unlock download, or use secret code from the TV remote!
                </p>
                {secretCodeInput.length > 0 && (
                  <p style={{ 
                    color: '#ff6666', 
                    textAlign: 'center', 
                    fontSize: '0.8rem',
                    margin: '5px 0 0 0'
                  }}>
                    Code: {secretCodeInput.join('')} {secretCodeInput.length === 4 ? (hackUnlocked ? '✓' : '✗') : ''}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {!isConnected && !isVideoUnlocked && (
            <div style={{ marginTop: '10px' }}>
              <p className={styles.tvInfo} style={{ color: '#ffcc00' }}>
                Connect your wallet and complete transaction to download this video, or use secret code from the TV remote!
              </p>
              {secretCodeInput.length > 0 && (
                <p style={{ 
                  color: '#ff6666', 
                  textAlign: 'center', 
                  fontSize: '0.8rem',
                  margin: '5px 0 0 0'
                }}>
                  Code: {secretCodeInput.join('')} {secretCodeInput.length === 4 ? (hackUnlocked ? '✓' : '✗') : ''}
                </p>
              )}
            </div>
          )}
          
          {isVideoUnlocked && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: 'rgba(0,0,0,0.2)', 
              borderRadius: '5px', 
              marginTop: '10px'
            }}>
              <p className={styles.tvInfo} style={{ 
                color: '#66ff66', 
                textAlign: 'center', 
                fontSize: '0.9rem',
                margin: 0
              }}>
                {hackUnlocked ? hackMessage : 'Transaction successful! Download is now available.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 