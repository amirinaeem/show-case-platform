import express from 'express';
const router = express.Router();
import { getApplications, getApplicationById } from '../controllers/applicationController.js';


router.route('/').get(getApplications);
router.route('/:id').get(getApplicationById);

export default router;