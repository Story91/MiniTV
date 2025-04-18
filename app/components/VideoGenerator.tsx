'use client';

import React, { useState } from 'react';
import { generateVideo } from '../utils/runway';

interface VideoGeneratorProps {
  imageUrl: string | null;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ imageUrl }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promptText, setPromptText] = useState('');

  const handleGenerate = async () => {
    if (!imageUrl) return;

    try {
      setIsGenerating(true);
      setError(null);
      const generatedVideoUrl = await generateVideo(
        imageUrl,
        promptText,
        5 // domyślna długość 5 sekund
      );
      setVideoUrl(generatedVideoUrl);
    } catch (error) {
      console.error('Generation failed:', error);
      setError('Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={imageUrl} alt="Uploaded" className="max-w-xs rounded-lg" />
      
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
      >
        {isGenerating ? 'Generating...' : 'Generate Video'}
      </button>

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {videoUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Generated Video:</h3>
          <video
            controls
            className="max-w-md rounded-lg"
            src={videoUrl}
          />
          <a
            href={videoUrl}
            download="generated-video.mp4"
            className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};