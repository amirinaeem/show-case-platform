import express from 'express';
const router = express.Router();
import { getApplications, getApplicationById, createApplication } from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


router.route('/').get(getApplications).post(protect, admin, createApplication);
router.route('/:id').get(getApplicationById);

export default router;