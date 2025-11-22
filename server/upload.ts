import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

import os from 'os';

const router = express.Router();

// Configure multer for disk storage to avoid memory crashes
// Use os.tmpdir() for Vercel/Serverless compatibility
const uploadDir = path.join(os.tmpdir(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      cb(null, `${timestamp}-${randomSuffix}-${file.originalname}`);
    },
  }),
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
  let tempFilePath: string | null = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    tempFilePath = file.path;
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    const fileKey = `videos/${timestamp}-${randomSuffix}-${file.originalname}`;

    console.log(`[Upload] Starting upload: ${file.originalname}, size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    const supabase = getSupabaseClient();

    // Read file as stream to avoid loading entire file in memory
    const fileBuffer = fs.readFileSync(tempFilePath);

    // Upload to Supabase Storage using SERVICE_ROLE_KEY (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileKey, fileBuffer, {
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

    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    res.json({
      url: publicUrl,
      key: fileKey,
      size: file.size,
      mimetype: file.mimetype,
    });
  } catch (error) {
    console.error('[Upload] Upload error:', error);

    // Clean up temp file on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error('[Upload] Failed to clean up temp file:', cleanupError);
      }
    }

    res.status(500).json({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Cleanup endpoint to remove old temp files (optional, can be called periodically)
router.post('/cleanup', async (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    let cleaned = 0;
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    }

    res.json({ message: `Cleaned up ${cleaned} old files` });
  } catch (error) {
    console.error('[Cleanup] Error:', error);
    res.status(500).json({ error: 'Cleanup failed' });
  }
});

export default router;
