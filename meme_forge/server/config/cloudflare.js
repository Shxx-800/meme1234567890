import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize Cloudflare R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export const uploadToR2 = async (buffer, fileName, contentType = 'image/png') => {
  try {
    const key = `memes/${uuidv4()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // Make the object publicly readable
      ACL: 'public-read',
    });

    await r2Client.send(command);
    
    // Return the public URL
    const publicUrl = `${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_BUCKET_NAME}/${key}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
};

export const getSignedUploadUrl = async (fileName, contentType = 'image/png') => {
  try {
    const key = `memes/${uuidv4()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour
    
    return {
      uploadUrl: signedUrl,
      key: key,
      publicUrl: `${process.env.CLOUDFLARE_R2_ENDPOINT}/${process.env.CLOUDFLARE_BUCKET_NAME}/${key}`
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
};

export default r2Client;