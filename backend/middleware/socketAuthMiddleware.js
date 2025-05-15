import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.cookie?.split('; ')
        .find((c) => c.startsWith('jwt='))
        ?.split('=')[1];

    if (!token) {
      return next(new Error('Not authorized: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('Not authorized: User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket auth error:', error.message);
    next(new Error('Not authorized: Invalid token'));
  }
};

export default socketAuthMiddleware;
