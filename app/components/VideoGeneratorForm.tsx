'use client';

import React, { useState } from 'react';
import { generateVideo } from '../utils/runway';

interface VideoGeneratorFormProps {
  imageData: {
    url: string;
  };
  onGenerationStart: () => void;
  onGenerationComplete: (videoUrl: string) => void;
  onProgress?: (progress: number, logs: string[]) => void;
}

export const VideoGeneratorForm: React.FC<VideoGeneratorFormProps> = ({
  imageData,
  onGenerationStart,
  onGenerationComplete,
  onProgress
}) => {
  const [promptText, setPromptText] = useState('');
  const [duration, setDuration] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsGenerating(true);
      setError(null);
      onGenerationStart();

      const videoUrl = await generateVideo(
        imageData.url,
        promptText,
        duration,
        onProgress
      );

      onGenerationComplete(videoUrl);
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Preview Image</h3>
        <img src={imageData.url} alt="Preview" className="w-full max-w-md mx-auto rounded-lg" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt Text (optional)
          </label>
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Describe the desired motion..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (seconds)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, Math.min(30, Number(e.target.value))))}
            min="1"
            max="30"
            className="w-32 p-2 border rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">Choose between 1-30 seconds</p>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          {isGenerating ? 'Generating Video...' : 'Generate Video'}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};