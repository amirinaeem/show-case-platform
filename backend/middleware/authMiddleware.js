// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';
import Application from '../models/applicationModel.js';

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('JWT Error:', error);
    throw new Error('Invalid token');
  }
};

// Get user from token
const getUserFromToken = async (token) => {
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

// HTTP Middleware
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  
  try {
    req.user = await getUserFromToken(token);
    next();
  } catch (error) {
    res.status(401).json({ message: error.message || 'Not authorized' });
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  res.status(403).json({ message: 'Not authorized as admin' });
};

// Resource ownership check helper
const checkOwnership = (resourceUser, reqUser) => {
  return resourceUser.toString() === reqUser._id.toString() || reqUser.isAdmin;
};

// Comment owner or admin middleware
const commentOwnerOrAdmin = asyncHandler(async (req, res, next) => {
  const { id: appId, commentId } = req.params;

  if (!mongoose.isValidObjectId(appId) || !mongoose.isValidObjectId(commentId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const application = await Application.findOne({ 
    _id: appId, 
    'comments._id': commentId 
  }).select('comments.$');

  if (!application?.comments?.length) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  const comment = application.comments[0];
  if (!checkOwnership(comment.user, req.user)) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  req.comment = comment;
  next();
});

// Reply owner or admin middleware
const replyOwnerOrAdmin = asyncHandler(async (req, res, next) => {
  const { id: appId, commentId, replyId } = req.params;

  if (!mongoose.isValidObjectId(appId) || !mongoose.isValidObjectId(commentId) || !mongoose.isValidObjectId(replyId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const application = await Application.findById(appId);
  if (!application) return res.status(404).json({ message: 'Application not found' });

  const comment = application.comments.id(commentId);
  const reply = comment?.replies?.id(replyId);

  if (!comment || !reply) {
    return res.status(404).json({ message: 'Comment or reply not found' });
  }

  if (!checkOwnership(reply.user, req.user)) {
    return res.status(403).json({ message: 'Not authorized to modify this reply' });
  }

  req.comment = comment;
  req.reply = reply;
  next();
});


export {
  protect,
  admin,
  commentOwnerOrAdmin,
  replyOwnerOrAdmin,
  
};