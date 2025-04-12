import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';
import Application from '../models/applicationModel.js';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    console.error('JWT Error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Comment owner or admin middleware
const commentOwnerOrAdmin = asyncHandler(async (req, res, next) => {
  const { id: appId, commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(appId) || !mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const application = await Application.findOne({
    _id: appId,
    'comments._id': commentId
  }).select('comments.$');

  if (!application) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  const comment = application.comments.find(c => c._id.toString() === commentId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  const isOwner = comment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.isAdmin;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  req.comment = comment;
  next();
});

export { protect, admin, commentOwnerOrAdmin };