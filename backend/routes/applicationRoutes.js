import express from 'express';
const router = express.Router();
import {
  getApplications,
  getApplicationById,
  createApplication,
  likeApplication,
  likeComment,
  addComment,
  editComment,
  deleteComment,
  addReply,
  editReply,
  deleteReply,
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

router.route('/:id/comments/:commentId/like')
  .post(protect, likeComment);

router.route('/:id/comments/:commentId/replies')
  .post(protect, addReply);

router.route('/:id/comments/:commentId/replies/:replyId')
  .put(protect, commentOwnerOrAdmin, editReply)
  .delete(protect, commentOwnerOrAdmin, deleteReply);

export default router;