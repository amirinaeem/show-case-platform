import mongoose from 'mongoose';


export const validateObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return mongoose.Types.ObjectId.isValid(id) &&
    new mongoose.Types.ObjectId(id).toString() === id;
};


export const validateCommentText = (comment) => {
  if (!comment || typeof comment !== 'string' || !comment.trim()) {
    throw new Error('Comment content is required and must be a non-empty string.');
  }
  if (comment.length > 5000) {  // You said 5000, but your message said 500 characters
    throw new Error('Comment/reply cannot exceed 5000 characters.');
  }
};
