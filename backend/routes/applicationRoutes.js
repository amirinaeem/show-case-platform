import express from 'express';
const router = express.Router();
import {
  getApplications,
  getApplicationById,
  createApplication,
  likeApplication,
  addComment,
  shareApplication,
  updateApplication,
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getApplications).post(protect, admin, createApplication);
router.route('/:id').get(getApplicationById).put(protect, admin, updateApplication);
router.route('/:id/like').post(protect, likeApplication);
router.route('/:id/comment').post(protect, addComment);
router.route('/:id/share').post(shareApplication);

export default router;