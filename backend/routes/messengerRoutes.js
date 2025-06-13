import express from 'express';
import { getFriends, messageSendDB, getMessage, sendFileMessage } from '../controllers/messengerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../config/multerConfig.js';

const router = express.Router();

router.get('/friends', protect, getFriends);
router.post('/send-message', protect, messageSendDB);

// Use uploadMultiple middleware for multiple file upload
router.post('/send-file-message', protect, uploadMultiple, sendFileMessage);

router.get('/get-message/:id', protect, getMessage);

export default router;
