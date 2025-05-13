// routes/messageRoutes.js

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  editMessage,
  reactToMessage,
  markAsRead,
  uploadAttachment
} from '../controllers/messageController.js';

const router = express.Router();

router.route('/conversations')
  .get(protect, getConversations)
  .post(protect, createConversation);

router.route('/conversations/:conversationId/messages')
  .get(protect, getMessages)
  .post(protect, sendMessage);

router.route('/messages/:messageId')
  .delete(protect, deleteMessage)
  .put(protect, editMessage);

router.post('/messages/:messageId/react', protect, reactToMessage);
router.post('/messages/:messageId/read', protect, markAsRead);
router.post('/upload-attachment', protect, uploadAttachment);

export default router;