import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const socketAuthMiddleware = async (socket, next) => {
  try {
    // Try to get token from auth first, then cookies
    let token = socket.handshake.auth?.token;
    
    if (!token && socket.handshake.headers?.cookie) {
      const cookies = socket.handshake.headers.cookie.split('; ')
        .reduce((acc, cookie) => {
          const [key, value] = cookie.split('=');
          acc[key] = value;
          return acc;
        }, {});
      
      token = cookies.jwt;
    }

    if (!token) {
      return next(new Error('Not authorized: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('Not authorized: User not found'));
    }

    // Attach user to socket for later use
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket auth error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return next(new Error('Not authorized: Token expired'));
    }
    next(new Error('Not authorized: Invalid token'));
  }
};

export default socketAuthMiddleware;