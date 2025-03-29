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
  .put(protect, editComment)         
  .delete(protect, deleteComment);  

  router.route('/:id/comments/:commentId/reply').post(protect, addReply); 

export default router;