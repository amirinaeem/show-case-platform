import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create messagingUploads directory if it doesn't exist
const messagingUploadsDir = path.join(process.cwd(), 'messagingUploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, messagingUploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `msg-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|webm|ogg|mp3|wav|pdf|doc|docx|txt/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images, videos, audio, and documents are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/messagingUploads/${req.file.filename}`;
  const fileType = req.file.mimetype.split('/')[0];

  res.json({
    url: fileUrl,
    type: fileType === 'application' ? 'document' : fileType,
    name: req.file.originalname,
    size: req.file.size
  });
});

export default router;