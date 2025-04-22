import express from 'express';
const router = express.Router();
import {
  getApplications,
  getApplicationById,
  createApplication,
  likeApplication,
  shareApplication,
  updateApplication,
  deleteApplication,
  createApplicationReview,
  getTopApplications,
  addComment,
  editComment,
  deleteComment,
  replyToComment,
  likeComment,
  likeToReply,  // Make sure this is imported
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

router.route('/:id/comments/:commentId/replies')
  .post(protect, replyToComment);

router.route('/:id/comments/:commentId/likeComment')
  .post(protect, likeComment);

// Fixed this route - was pointing to likeComment instead of likeToReply
router.route('/:id/comments/:commentId/replies/:replyId/likeReply')
  .post(protect, likeToReply);  // Changed from likeComment to likeToReply

export default router;