export interface ImgBBResponse {
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
  
  export async function uploadToImgBB(file: File): Promise<ImgBBResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);
  
      const response = await fetch(`https://api.imgbb.com/1/upload?key=748b96b27e1513adf627d33f048878b3`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: ImgBBResponse = await response.json();
  
      if (!data.success) {
        throw new Error('Failed to upload image to ImgBB');
      }
  
      // Return the full ImgBBResponse object instead of just the URL
      return data;
    } catch (error) {
      console.error('Error uploading to ImgBB:', error);
      throw new Error('Failed to upload image to ImgBB');
    }
  }