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
  likeToReply,
  editReply,  // Make sure this is imported
} from '../controllers/applicationController.js';
import { protect, admin, commentOwnerOrAdmin, replyOwnerOrAdmin } from '../middleware/authMiddleware.js';

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

router.route('/:id/comments/:commentId/deleteComment')
  .delete(protect, commentOwnerOrAdmin, deleteComment);

router.route('/:id/comments/:commentId/editComment')
.put(protect, commentOwnerOrAdmin, editComment)
  
router.route('/:id/comments/:commentId/likeComment')
  .post(protect, likeComment);

router.route('/:id/comments/:commentId/replies')
  .post(protect, replyToComment);

router.route('/:id/comments/:commentId/replies/:replyId/editReply').put(protect, replyOwnerOrAdmin, editReply)
  
router.route('/:id/comments/:commentId/replies/:replyId/likeReply').post(protect, likeToReply); 

export default router;