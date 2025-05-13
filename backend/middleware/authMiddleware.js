import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';
import Application from '../models/applicationModel.js';

// Protect routes (HTTP Middleware)
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
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

  const application = await Application.findOne({ _id: appId, 'comments._id': commentId }).select('comments.$');

  if (!application || !application.comments.length) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  const comment = application.comments[0];
  const isOwner = comment.user.toString() === req.user._id.toString();
  const isAdmin = req.user.isAdmin;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  req.comment = comment;
  next();
});

// Reply owner or admin middleware
const replyOwnerOrAdmin = asyncHandler(async (req, res, next) => {
  const { id: appId, commentId, replyId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(appId) ||
    !mongoose.Types.ObjectId.isValid(commentId) ||
    !mongoose.Types.ObjectId.isValid(replyId)
  ) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const application = await Application.findById(appId);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const comment = application.comments.id(commentId);
  const reply = comment?.replies?.id(replyId);

  if (!comment || !reply) {
    return res.status(404).json({ message: 'Comment or reply not found' });
  }

  const isOwner = reply.user.toString() === req.user._id.toString();
  const isAdmin = req.user.isAdmin;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: 'Not authorized to modify this reply' });
  }

  req.comment = comment;
  req.reply = reply;
  next();
});

// ✅ Socket.io authentication middleware
const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user; // Attach user to socket
    next();
  } catch (error) {
    console.error('Socket JWT Error:', error);
    return next(new Error('Authentication error: Invalid token'));
  }
};

export {
  protect,
  admin,
  commentOwnerOrAdmin,
  replyOwnerOrAdmin,
  socketAuth,
};
