import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  uploadAppImage,
  uploadAppVideo,
  uploadMessagingFile,
  uploadAvatar
} from '../controllers/uploadController.js';
import { upload } from '../config/multerConfig.js';

const router = express.Router();

// All routes use 'upload.single' and different folder logic
router.post('/image', protect, upload.single('file'), uploadAppImage);
router.post('/video', protect, upload.single('file'), uploadAppVideo);
router.post('/messaging', protect, upload.single('file'), uploadMessagingFile);
router.post('/avatar', upload.single('file'), uploadAvatar); // optional auth

export default router;
