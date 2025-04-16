import express from 'express';
const router = express.Router();
import {
  getApplications,
  getApplicationById,
  createApplication,
  likeApplication,
  addComment,
  editComment,
  deleteComment,
  shareApplication,
  updateApplication,
  deleteApplication,
  createApplicationReview,
  getTopApplications
} from '../controllers/applicationController.js';
import { protect, admin, commentOwnerOrAdmin } from '../middleware/authMiddleware.js';

// ======================
// Public Routes
// ======================
router.route('/')
  .get(getApplications);

router.get('/top', getTopApplications);

router.route('/:id')
  .get(getApplicationById);

// ======================
// Admin-only Routes
// ======================
router.route('/')
  .post(protect, admin, createApplication);

router.route('/:id')
  .put(protect, admin, updateApplication)
  .delete(protect, admin, deleteApplication);

// ======================
// Authenticated User Routes
// ======================
router.route('/:id/like')
  .post(protect, likeApplication);

router.route('/:id/share')
  .post(protect, shareApplication);

router.route('/:id/reviews')
  .post(protect, createApplicationReview);

// ======================
// Comment System Routes
// ======================
router.route('/:id/comments')
  .post(protect, addComment);

router.route('/:id/comments/:commentId')
  .put(protect, commentOwnerOrAdmin, editComment)
  .delete(protect, commentOwnerOrAdmin, deleteComment);


export default router;