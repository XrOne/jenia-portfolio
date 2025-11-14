import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Configure multer for memory storage with 2GB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  },
});

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use SERVICE_ROLE_KEY to bypass RLS
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `videos/${timestamp}-${randomSuffix}-${file.originalname}`;

    console.log(`[Upload] Starting upload: ${file.originalname}, size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    const supabase = getSupabaseClient();
    
    // Upload to Supabase Storage using SERVICE_ROLE_KEY (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileKey, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('[Upload] Supabase upload error:', uploadError);
      return res.status(500).json({ 
        error: 'Upload failed', 
        details: uploadError.message 
      });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(fileKey);

    console.log(`[Upload] Upload successful: ${fileKey}`);

    res.json({
      url: publicUrl,
      key: fileKey,
      size: file.size,
      mimetype: file.mimetype,
    });
  } catch (error) {
    console.error('[Upload] Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
