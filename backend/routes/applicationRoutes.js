import express from 'express';
import { getLinkPreview } from 'link-preview-js';
import NodeCache from 'node-cache';
const router = express.Router();
const previewCache = new NodeCache({ stdTTL: 3600 });

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
  editReply,
  deleteReply
} from '../controllers/applicationController.js';
import { protect, admin, commentOwnerOrAdmin, replyOwnerOrAdmin } from '../middleware/authMiddleware.js';


// ======================
// Link Preview Route (with cache)
// ======================
router.get('/link-preview', async (req, res) => {
  const { url, noCache } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  if (noCache) previewCache.del(url); // Support cache busting

  const cached = previewCache.get(url);
  if (cached) return res.json(cached);

  try {
    const preview = await getLinkPreview(url, {
      timeout: 5000,
      followRedirects: 'follow',
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const result = {
      url: preview.url,
      title: preview.title || 'No title',
      description: preview.description || '',
      image: Array.isArray(preview.images) && preview.images.length > 0 ? preview.images[0] : null
    };

    previewCache.set(url, result); // Cache the result
    res.json(result);

  } catch (err) {
    console.error("Backend failed to fetch link preview:", err);
    res.status(500).json({
      error: 'Failed to fetch link preview',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

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

router.route('/:id/comments/:commentId/replies/:replyId/editReply').put(protect, replyOwnerOrAdmin, editReply);

router.route('/:id/comments/:commentId/replies/:replyId/deleteReply').delete(protect, replyOwnerOrAdmin, deleteReply);
  
router.route('/:id/comments/:commentId/replies/:replyId/likeReply').post(protect, likeToReply); 

export default router;