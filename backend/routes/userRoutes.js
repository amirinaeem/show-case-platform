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

// Corrected routes
router.route('/').post(registerUser).get(getUsers);
router.post('/logout', logoutUser); // Use router.post() for logout
router.post('/login', authUser); // Use router.post() for login
router.route('/profile').get(getUserProfile).put(updateUserProfile);
router.route('/:id').delete(deleteUser).get(getUserByID).put(updateUser);

export default router;