// backend/routes/index.js
import { Router } from 'express';
import applicationRoutes from './applicationRoutes.js';
import userRoutes from './userRoutes.js';
import orderRoutes from './orderRoutes.js';
import uploadRoutes from './uploadRoute.js';



const router = Router();

// Mount all routes
router.use('/applications', applicationRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/uploads', uploadRoutes);



export default router;