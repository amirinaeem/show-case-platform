import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  uploadAppImage,
  uploadAppVideo,
  uploadMessengerFiles,
  uploadMessengerImages,
  uploadAvatar
} from '../controllers/uploadController.js';
import { uploadSingle, uploadMultiple } from '../config/multerConfig.js';

const router = express.Router();

// Upload routes using enhanced middleware with automatic cleanup
router.post('/image', protect, uploadSingle('file'), uploadAppImage);
router.post('/video', protect, uploadSingle('file'), uploadAppVideo);
router.post('/files', protect, uploadMultiple('files'), uploadMessengerFiles);
router.post('/images', protect, uploadMultiple('files'), uploadMessengerImages);
router.post('/avatar', uploadSingle('file'), uploadAvatar);

export default router;