interface GenerationResponse {
    status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
    progress?: number;
    videoUrl?: string;
    previewUrl?: string;
    downloadUrl?: string;
    error?: string;
    logs?: string[];
  }
  
  export async function generateVideo(
    imageUrl: string,
    promptText: string,
    duration: number = 5,
    onProgress?: (progress: number, logs: string[]) => void
  ): Promise<string> {
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes maximum
  
    while (attempts < maxAttempts) {
      try {
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl,
            promptText,
            duration,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate video');
        }
  
        const data: GenerationResponse = await response.json();
  
        // Handle different status responses
        switch (data.status) {
          case 'PROCESSING':
            if (onProgress && data.progress) {
              onProgress(data.progress, data.logs || []);
            }
            // Continue polling
            break;
  
          case 'SUCCEEDED':
            if (data.videoUrl) {
              if (onProgress) {
                onProgress(100, ['Video generation completed!']);
              }
              return data.videoUrl;
            }
            throw new Error('No video URL in success response');
  
          case 'FAILED':
            throw new Error(data.error || 'Video generation failed');
  
          default:
            // Continue polling for other states
            break;
        }
  
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error in video generation:', error);
        throw error;
      }
    }
  
    throw new Error('Video generation timed out');
  }