'use client';

import React, { useState } from 'react';
import { uploadToImgBB, ImgBBResponse } from '../utils/imgbb';

interface ImageUploaderProps {
  onImageUploaded: (imageData: { url: string }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<ImgBBResponse | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      
      const response = await uploadToImgBB(file);
      console.log('ImgBB Response:', response);
      
      setUploadedImage(response);
      
      // Przekaż URL obrazu
      onImageUploaded({
        url: response.data.display_url
      });
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Upload Your Image</h3>
        <p className="text-sm text-gray-600 mb-4">
          Image aspect ratio must be between 1:2 and 2:1
        </p>
      </div>
      
      <label className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
        {isUploading ? 'Uploading...' : 'Select Image'}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      {isUploading && (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Uploading image...</p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {uploadedImage && (
        <div className="mt-4 w-full max-w-xl">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Image Upload Success:</h4>
            <img 
              src={uploadedImage.data.display_url} 
              alt="Preview" 
              className="max-w-xs rounded-lg shadow-lg mx-auto"
            />
            <div className="mt-4 p-2 bg-gray-100 rounded">
              <p className="text-sm font-mono break-all">
                Image URL: {uploadedImage.data.display_url}
              </p>
            </div>
            <p className="text-sm text-green-600 mt-4 text-center">
              Image uploaded successfully! Click "Generate Video" to continue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};