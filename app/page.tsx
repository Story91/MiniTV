'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import ArrowSvg from './svg/ArrowSvg';
import ImageSvg from './svg/Image';
import OnchainkitSvg from './svg/OnchainKit';
import { useState, useRef, useEffect } from 'react';
import { RetroTVApp, TVUploadForm, TVCustomizeForm, TVGenerateComponent, TVVideoComponent } from './components/RetroTV';
import { ImageUploader } from './components/ImageUploader';
import { VideoGenerator } from './components/VideoGenerator';
import { VideoGeneratorForm } from './components/VideoGeneratorForm';

interface ImgBBResponse {
  data: {
    url: string;
    display_url: string;
    delete_url: string;
    title: string;
    time: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
  };
  success: boolean;
  status: number;
}

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imgbbResponse, setImgbbResponse] = useState<ImgBBResponse | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [promptText, setPromptText] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(5);
  const [guidanceScale, setGuidanceScale] = useState<number>(12.5);
  const [motionBucketId, setMotionBucketId] = useState<number>(127);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1000000000));
  const [model, setModel] = useState<string>('gen4_turbo');
  const [ratio, setRatio] = useState<string>('1280:720');
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [taskId, setTaskId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    
    if (isGeneratingVideo) {
      setGenerationProgress(0);
      setGenerationLogs(['Starting video generation...']);
      
      progressInterval = setInterval(() => {
        setGenerationProgress(currentProgress => {
          if (currentProgress < 95) {
            const increment = 95 - currentProgress > 30 ? 5 : 1;
            return currentProgress + increment;
          }
          return currentProgress;
        });
        
        setGenerationLogs(prevLogs => {
          if (prevLogs.length > 5) return prevLogs;
          
          const progress = generationProgress;
          if (progress < 20 && !prevLogs.includes('Analyzing image...')) {
            return [...prevLogs, 'Analyzing image...'];
          } else if (progress >= 20 && progress < 40 && !prevLogs.includes('Preparing generation parameters...')) {
            return [...prevLogs, 'Preparing generation parameters...'];
          } else if (progress >= 40 && progress < 60 && !prevLogs.includes('Processing in progress...')) {
            return [...prevLogs, 'Processing in progress...'];
          } else if (progress >= 60 && progress < 80 && !prevLogs.includes('Rendering video frames...')) {
            return [...prevLogs, 'Rendering video frames...'];
          } else if (progress >= 80 && !prevLogs.includes('Almost done...')) {
            return [...prevLogs, 'Almost done...'];
          }
          return prevLogs;
        });
      }, 1000);
    } else if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isGeneratingVideo]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 32 * 1024 * 1024) {
        setError('File size must be less than 32MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setError('');
      setImgbbResponse(null);
      setVideoUrl('');
      setGenerationProgress(0);
      setGenerationLogs([]);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      uploadFileToImgBB(file);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const uploadFileToImgBB = async (file: File) => {
    setIsLoading(true);
    setError('');
    setUploadProgress('Uploading image to ImgBB...');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('https://api.imgbb.com/1/upload?key=748b96b27e1513adf627d33f048878b3', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('ImgBB Response:', data);
      setImgbbResponse(data);
      if (!data.success) {
        throw new Error('Failed to upload image to ImgBB');
      }
      setUploadProgress('Image uploaded successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setImgbbResponse(null);
    setVideoUrl('');
    setError('');
    setUploadProgress('');
    setGenerationProgress(0);
    setGenerationLogs([]);
    setPromptText('');
    setVideoDuration(5);
    setGuidanceScale(12.5);
    setMotionBucketId(127);
    setSeed(Math.floor(Math.random() * 1000000000));
    setModel('gen4_turbo');
    setRatio('1280:720');
    setGenerationStatus('');
    setTaskId('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    await uploadFileToImgBB(selectedFile);
  };

  const handleGenerateVideo = async () => {
    if (!imgbbResponse?.data.display_url) {
      setError('Please upload an image first');
      return;
    }
    setIsGeneratingVideo(true);
    setError('');
    setGenerationProgress(0);
    setGenerationLogs(['Starting video generation...']);
    setVideoUrl('');
    setGenerationStatus('PROCESSING');
    setTaskId('');
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imgbbResponse.data.display_url,
          promptText,
          duration: videoDuration,
          guidance_scale: guidanceScale,
          motion_bucket_id: motionBucketId,
          seed: seed,
          model: model,
          ratio: ratio
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      
      setGenerationProgress(100);
      
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setGenerationLogs(prevLogs => [...prevLogs, 'Video generation completed!']);
        setGenerationStatus('SUCCEEDED');
        if (data.taskId) {
          setTaskId(data.taskId);
        }
      } else {
        if (data.status) {
          setGenerationStatus(data.status);
        }
        if (data.taskId) {
          setTaskId(data.taskId);
        }
        throw new Error('No video URL in response');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate video. Please try again.');
      setGenerationLogs(prevLogs => [...prevLogs, 'Error: Failed to generate video']);
      setGenerationStatus('FAILED');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-video.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading video:', error);
      setError('Failed to download video');
    }
  };

  // Components to be used with RetroTVApp
  const uploadComponent = (
    <TVUploadForm
      selectedFile={selectedFile}
      previewUrl={previewUrl}
      isLoading={isLoading}
      uploadProgress={uploadProgress}
      error={error}
      handleFileSelect={handleFileSelect}
      handleUpload={handleUpload}
      resetForm={resetForm}
    />
  );

  const customizeComponent = (
    <TVCustomizeForm
      imgbbResponse={imgbbResponse}
      promptText={promptText}
      videoDuration={videoDuration}
      guidanceScale={guidanceScale}
      motionBucketId={motionBucketId}
      seed={seed}
      setPromptText={setPromptText}
      setVideoDuration={setVideoDuration}
      setGuidanceScale={setGuidanceScale}
      setMotionBucketId={setMotionBucketId}
      setSeed={setSeed}
      model={model}
      setModel={setModel}
      ratio={ratio}
      setRatio={setRatio}
    />
  );

  const generateComponent = (
    <TVGenerateComponent
      imgbbResponse={imgbbResponse}
      isGeneratingVideo={isGeneratingVideo}
      generationProgress={generationProgress}
      generationLogs={generationLogs}
      handleGenerateVideo={handleGenerateVideo}
      generationStatus={generationStatus}
      taskId={taskId}
      model={model}
      ratio={ratio}
      videoDuration={videoDuration}
      guidanceScale={guidanceScale}
      motionBucketId={motionBucketId}
      promptText={promptText}
    />
  );

  const videoComponent = (
    <TVVideoComponent
      videoUrl={videoUrl}
      handleDownload={handleDownload}
    />
  );

  return (
    <main className="min-h-screen bg-gray-900">
      <RetroTVApp
        uploadComponent={uploadComponent}
        customizeComponent={customizeComponent}
        generateComponent={generateComponent}
        videoComponent={videoComponent}
      />
    </main>
  );
}
