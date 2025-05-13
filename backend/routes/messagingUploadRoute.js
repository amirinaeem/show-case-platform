import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Multer config — use temp folder for Cloudinary uploads
const upload = multer({
  dest: './temp_uploads',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|webm|ogg|mp3|wav|pdf|doc|docx|txt/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images, videos, audio, and documents are allowed'));
  }
});

// Upload route
router.post('/', protect, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, {
      folder: 'messaging',
      resource_type: 'auto',
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
      type: result.resource_type === 'raw' ? 'document' : result.resource_type,
      name: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
