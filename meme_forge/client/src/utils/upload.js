// Utility functions for uploading memes to Cloudflare R2

const API_BASE_URL = 'http://localhost:3001';

export const uploadMemeToCloud = async (canvas, fileName = 'meme.png') => {
  try {
    // Convert canvas to blob
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png', 0.9);
    });

    // Create FormData
    const formData = new FormData();
    formData.append('meme', blob, fileName);

    // Upload to server
    const response = await fetch(`${API_BASE_URL}/upload-meme`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading meme:', error);
    throw error;
  }
};

export const getUploadUrl = async (fileName, contentType = 'image/png') => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, contentType }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting upload URL:', error);
    throw error;
  }
};