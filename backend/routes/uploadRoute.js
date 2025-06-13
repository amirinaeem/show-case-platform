import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  uploadAppImage,
  uploadAppVideo,
  uploadMessagingFile,
  uploadAvatar
} from '../controllers/uploadController.js';
import { uploadSingle } from '../config/multerConfig.js';

const router = express.Router();

// Upload routes using common uploadSingle middleware
router.post('/image', protect, uploadSingle, uploadAppImage);
router.post('/video', protect, uploadSingle, uploadAppVideo);
router.post('/messaging', protect, uploadSingle, uploadMessagingFile);

// Avatar upload (auth optional)
router.post('/avatar', uploadSingle, uploadAvatar);

export default router;
