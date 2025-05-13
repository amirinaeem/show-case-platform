// routes/messagingUploadRoute.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { UPLOAD_CONFIG } from '../utils/uploadConfig.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_CONFIG.MESSAGING_UPLOADS.dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `msg-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const extname = UPLOAD_CONFIG.MESSAGING_UPLOADS.fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = UPLOAD_CONFIG.MESSAGING_UPLOADS.fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images, videos, audio, and documents are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: UPLOAD_CONFIG.MESSAGING_UPLOADS.limits
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