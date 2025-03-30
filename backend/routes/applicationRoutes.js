import express from 'express';
const router = express.Router();
import {
  getApplications,
  getApplicationById,
  createApplication,
  likeApplication,
  likeComment,  // Add this import
  addComment,
  editComment,
  deleteComment,
  addReply,
  shareApplication,
  updateApplication,
  deleteApplication,
  createApplicationReview,
  getTopApplications
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Public routes
router.route('/').get(getApplications);
router.get('/top', getTopApplications);
router.route('/:id').get(getApplicationById);

// Admin-only routes
router.route('/').post(protect, admin, createApplication);
router.route('/:id').put(protect, admin, updateApplication).delete(protect, admin, deleteApplication);

// Authenticated user routes
router.route('/:id/like').post(protect, likeApplication);
router.route('/:id/share').post(protect, shareApplication);
router.route('/:id/reviews').post(protect, createApplicationReview);

// Comment system routes
router.route('/:id/comments')
  .post(protect, addComment)          

  // Backend (routes/applicationRoutes.js)
router.route('/:id/comments/:commentId')
.put(protect, editComment)  // Now matches the frontend's URL structure
.delete(protect, deleteComment);

router.route('/:id/comments/:commentId/replies')
  .post(protect, addReply);

// Add new route for comment likes
router.route('/:id/comments/:commentId/like')
  .post(protect, likeComment);

export default router;