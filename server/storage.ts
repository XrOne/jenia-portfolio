// Supabase Storage helpers
import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'videos';

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Upload a file to Supabase Storage
 * @param relKey - Relative path in the bucket (e.g., "videos/myfile.mp4")
 * @param data - File data as Buffer, Uint8Array, or string
 * @param contentType - MIME type of the file
 * @returns Object with key and public URL
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const supabase = getSupabaseClient();
  const key = relKey.replace(/^\/+/, ''); // Remove leading slashes
  
  // Convert string to Uint8Array if needed
  const fileData = typeof data === 'string' 
    ? new TextEncoder().encode(data)
    : data;
  
  const { data: uploadData, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(key, fileData, {
      contentType,
      upsert: true, // Overwrite if exists
    });
  
  if (error) {
    throw new Error(`Supabase storage upload failed: ${error.message}`);
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key);
  
  return { key, url: publicUrl };
}

/**
 * Get the public URL for a file in Supabase Storage
 * @param relKey - Relative path in the bucket
 * @returns Object with key and public URL
 */
export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const supabase = getSupabaseClient();
  const key = relKey.replace(/^\/+/, '');
  
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key);
  
  return { key, url: publicUrl };
}

/**
 * Delete a file from Supabase Storage
 * @param relKey - Relative path in the bucket
 */
export async function storageDelete(relKey: string): Promise<void> {
  const supabase = getSupabaseClient();
  const key = relKey.replace(/^\/+/, '');
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([key]);
  
  if (error) {
    throw new Error(`Supabase storage delete failed: ${error.message}`);
  }
}
