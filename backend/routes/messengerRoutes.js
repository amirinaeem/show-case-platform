// routes/messengerRoutes.js
import express from 'express';
const router = express.Router();
import { getFriends } from '../controllers/messengerController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/friends', protect, getFriends);

export default router;