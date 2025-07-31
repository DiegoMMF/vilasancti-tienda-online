import { del, list, put } from '@vercel/blob';
import { z } from 'zod';

const uploadSchema = z.object({
  name: z.string(),
  type: z.string().startsWith('image/'),
  size: z.number().max(10 * 1024 * 1024), // 10MB max
});

export async function uploadImage(file: File, folder: string = 'products') {
  try {
    // Validate file
    const validatedFile = uploadSchema.parse({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

    // Upload to Blob Storage
    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return {
      url,
      filename,
      success: true,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      url: null,
      filename: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteImage(url: string) {
  try {
    await del(url);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function listImages(prefix: string) {
  try {
    const { blobs } = await list({ prefix });
    return {
      images: blobs.map(blob => ({
        url: blob.url,
        filename: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
      success: true,
    };
  } catch (error) {
    console.error('Error listing images:', error);
    return {
      images: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
} 