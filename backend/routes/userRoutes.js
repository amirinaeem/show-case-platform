import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByID,
    deleteUser,
    updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Register new user
router.route('/').post(registerUser).get(protect, getUsers);

// Login user
router.post('/auth', authUser);

// Logout
router.post('/logout', logoutUser);

// Profile routes
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Admin user routes
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserByID)
  .put(protect, admin, updateUser);

export default router;
