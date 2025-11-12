import express from 'express';
import multer from 'multer';
import { storagePut } from './supabase-storage';

const router = express.Router();

// Configure multer for memory storage with higher limits for video files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000 * 1024 * 1024, // 1GB limit for high-quality videos
  },
  fileFilter: (req, file, cb) => {
    // Accept videos and images
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only videos and images are allowed.'));
    }
  },
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(7);
    
    // Determine folder based on file type
    const folder = file.mimetype.startsWith('video/') ? 'videos' : 'thumbnails';
    
    // Clean filename and create unique key
    const cleanFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `${folder}/${timestamp}-${randomSuffix}-${cleanFilename}`;

    console.log(`Uploading file: ${fileKey} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Upload to Supabase Storage
    const { url } = await storagePut(
      fileKey,
      file.buffer,
      file.mimetype
    );

    console.log(`Upload successful: ${url}`);

    res.json({
      url,
      key: fileKey,
      size: file.size,
      mimetype: file.mimetype,
      filename: file.originalname,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
router.get('/upload/health', (req, res) => {
  res.json({ status: 'ok', service: 'upload', storage: 'supabase' });
});

export default router;
