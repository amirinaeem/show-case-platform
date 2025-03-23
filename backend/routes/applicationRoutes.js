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
  deleteApplication,
  createApplicationReview,
  getTopApplications
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getApplications).post(protect, admin, createApplication);
router.get('/top', getTopApplications)
router.route('/:id').get(getApplicationById).put(protect, admin, updateApplication).delete(protect, admin, deleteApplication);
router.route('/:id/like').post(protect, likeApplication);
router.route('/:id/comment').post(protect, addComment);
router.route('/:id/share').post(shareApplication);
router.route('/:id/reviews').post(protect, createApplicationReview);

export default router;