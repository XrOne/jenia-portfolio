import express from 'express';
import multer from 'multer';
import { storagePut } from './storage';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
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
    const fileKey = `videos/${timestamp}-${randomSuffix}-${file.originalname}`;

    const { url } = await storagePut(
      fileKey,
      file.buffer,
      file.mimetype
    );

    res.json({
      url,
      key: fileKey,
      size: file.size,
      mimetype: file.mimetype,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
