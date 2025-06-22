import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getFriends, 
  messageSendDB, 
  getMessage 
} from '../controllers/messengerController.js';

const router = express.Router();

router.get('/friends', protect, getFriends);
router.post('/send-message', protect, messageSendDB);
router.get('/get-message/:id', protect, getMessage);

export default router;