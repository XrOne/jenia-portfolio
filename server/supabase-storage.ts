import { createClient } from '@supabase/supabase-js';
import { ENV } from './_core/env';

// Initialize Supabase client
const supabase = createClient(
  ENV.supabaseUrl,
  ENV.supabaseServiceRoleKey, // Using service role for server-side operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface UploadResult {
  key: string;
  url: string;
}

/**
 * Upload a file to Supabase Storage
 * @param relKey - The relative path/key for the file (e.g., 'videos/my-video.mp4')
 * @param data - File data as Buffer, Uint8Array, or Blob
 * @param contentType - MIME type of the file
 * @returns Object containing the file key and public URL
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | Blob,
  contentType = 'application/octet-stream'
): Promise<UploadResult> {
  const bucketName = ENV.supabaseBucketName;
  
  // Normalize the key (remove leading slashes)
  const key = relKey.replace(/^\/+/, '');
  
  try {
    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from(bucketName)
      .upload(key, data, {
        contentType,
        upsert: true, // Overwrite if exists
        cacheControl: '3600',
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(key);

    return {
      key,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Storage upload error:', error);
    throw error;
  }
}

/**
 * Get the public URL for a stored file
 * @param relKey - The relative path/key of the file
 * @returns Object containing the file key and public URL
 */
export async function storageGet(relKey: string): Promise<UploadResult> {
  const bucketName = ENV.supabaseBucketName;
  const key = relKey.replace(/^\/+/, '');
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(key);

  return {
    key,
    url: publicUrl,
  };
}

/**
 * Delete a file from Supabase Storage
 * @param relKey - The relative path/key of the file to delete
 */
export async function storageDelete(relKey: string): Promise<void> {
  const bucketName = ENV.supabaseBucketName;
  const key = relKey.replace(/^\/+/, '');
  
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([key]);

  if (error) {
    throw new Error(`Supabase delete failed: ${error.message}`);
  }
}

/**
 * List files in a directory
 * @param prefix - Directory prefix to list files from
 */
export async function storageList(prefix: string = ''): Promise<string[]> {
  const bucketName = ENV.supabaseBucketName;
  
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(prefix);

  if (error) {
    throw new Error(`Supabase list failed: ${error.message}`);
  }

  return data?.map(file => file.name) || [];
}

export { supabase };
