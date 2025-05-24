import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const setupSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId || decoded._id;
      next();
    } catch (err) {
      console.error("Invalid token", err);
      return next(new Error("Authentication error"));
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('user-connected', async ({ userId }) => {
      if (!userId) return;
      await User.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true,
        status: 'online',
      });
      console.log(`User ${userId} is now online with socket ID ${socket.id}`);
    });

    socket.on('disconnect', async () => {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        await User.findByIdAndUpdate(user._id, {
          socketId: null,
          isOnline: false,
          status: 'offline',
          lastSeen: new Date(),
        });
        console.log(`User ${user._id} is now offline`);
      }
    });
  });
};
