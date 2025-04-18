'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './RetroTV.module.css';

interface RetroTVProps {
  children: React.ReactNode;
  isOn?: boolean;
  staticIntensity?: number;
  showStatic?: boolean;
  showScanlines?: boolean;
  model?: 'gen4_turbo' | 'gen3a_turbo';
  aspectRatio?: string;
  generationStatus?: string;
  taskId?: string;
  progress?: number;
  onModelChange?: (model: 'gen4_turbo' | 'gen3a_turbo') => void;
  onAspectRatioChange?: (ratio: string) => void;
}

const RetroTV: React.FC<RetroTVProps> = ({
  children,
  isOn = true,
  staticIntensity = 0.2,
  showStatic = true,
  showScanlines = true,
  model = 'gen4_turbo',
  aspectRatio = '16:9',
  generationStatus = '',
  taskId = '',
  progress = 0,
  onModelChange,
  onAspectRatioChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // TV static effect
  useEffect(() => {
    if (!canvasRef.current || !showStatic || !isOn) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw TV static noise
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const randomValue = Math.floor(Math.random() * 255);
        const alpha = Math.random() * staticIntensity * 255;
        
        data[i] = randomValue;     // Red
        data[i + 1] = randomValue; // Green
        data[i + 2] = randomValue; // Blue
        data[i + 3] = alpha;       // Alpha
      }
      
      ctx.putImageData(imageData, 0, 0);
      animationFrameId = requestAnimationFrame(renderStatic);
    };

    // Start animation when component mounts
    renderStatic();

    // Make canvas responsive
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [staticIntensity, showStatic, isOn]);

  // Transition effect
  useEffect(() => {
    if (isOn) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOn]);

  // Handle model change
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value as 'gen4_turbo' | 'gen3a_turbo';
    if (onModelChange) {
      onModelChange(newModel);
    }
  };

  // Handle aspect ratio change
  const handleAspectRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRatio = e.target.value;
    if (onAspectRatioChange) {
      onAspectRatioChange(newRatio);
    }
  };

  return (
    <div className={styles.tvContainer}>
      <div className={styles.tvOuter}>
        <div className={`${styles.tvInner} ${isOn ? styles.on : ''}`}>
          <div 
            className={styles.tvScreen}
            style={{
              aspectRatio: aspectRatio.replace(':', '/'),
            }}
          >
            {showScanlines && <div className={styles.scanlines} style={{ pointerEvents: 'none' }}></div>}
            <div 
              className={`${styles.tvContent} ${isVisible ? styles.visible : ''}`}
              style={{ 
                position: 'relative',
                zIndex: 3
              }}
            >
              {children}
            </div>
            {showStatic && (
              <canvas 
                ref={canvasRef} 
                className={styles.staticOverlay} 
                style={{ 
                  pointerEvents: 'none',
                  opacity: 0.5
                }} 
              />
            )}
            <div className={styles.glare} style={{ pointerEvents: 'none' }}></div>
            <div className={styles.scanline} style={{ pointerEvents: 'none' }}></div>
          </div>
          <div className={styles.tvBottom} style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
            <div className={styles.tvControls}>
              <div className={styles.tvPowerButton}></div>
              <div className={styles.tvChannel}></div>
              <div className={styles.tvVolume}></div>
            </div>
            <div className={styles.navigationControls} style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
              {/* Navigation buttons will be inserted here */}
            </div>
            
            {/* Status section displaying generation progress */}
            {generationStatus && (
              <div className={styles.statusInfo}>
                <div className={styles.statusRow}>
                  <span>Status: {generationStatus}</span>
                  {taskId && <span>Task ID: {taskId}</span>}
                </div>
                {progress > 0 && (
                  <div className={styles.progressContainer}>
                    <div 
                      className={styles.progressBar}
                      style={{ width: `${progress}%` }}
                    ></div>
                    <span className={styles.progressText}>{progress}%</span>
                  </div>
                )}
                <div className={styles.modelInfo}>
                  <select 
                    className={styles.tvSelect} 
                    value={model}
                    onChange={handleModelChange}
                  >
                    <option value="gen4_turbo">Gen 4 Turbo</option>
                    <option value="gen3a_turbo">Gen 3a Turbo</option>
                  </select>
                  <select 
                    className={styles.tvSelect} 
                    value={aspectRatio}
                    onChange={handleAspectRatioChange}
                  >
                    <option value="16:9">16:9</option>
                    <option value="4:3">4:3</option>
                    <option value="1:1">1:1</option>
                    <option value="9:16">9:16</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroTV; 