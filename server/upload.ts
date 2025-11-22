import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use SERVICE_ROLE_KEY to bypass RLS
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

router.post('/upload-url', async (req, res) => {
  try {
    const { fileName, contentType } = req.body ?? {};

    if (!fileName) {
      return res.status(400).json({ error: 'fileName is required' });
    }

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `videos/${timestamp}-${randomSuffix}-${fileName}`;

    console.log(`[Upload] Creating signed URL for: ${fileName}`);

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage
      .from('videos')
      .createSignedUploadUrl(fileKey, 60 * 30, {
        upsert: true,
        contentType,
      });

    if (error || !data?.signedUrl) {
      console.error('[Upload] Failed to create signed URL:', error);
      return res.status(500).json({
        error: 'Failed to create signed upload URL',
        details: error?.message,
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileKey);

    return res.json({
      key: fileKey,
      uploadUrl: data.signedUrl,
      publicUrl: publicUrlData.publicUrl,
      expiresIn: 60 * 30,
    });
  } catch (error) {
    console.error('[Upload] Upload URL error:', error);
    return res.status(500).json({
      error: 'Failed to prepare upload',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
