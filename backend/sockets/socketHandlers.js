import User from '../models/userModel.js';
import redis from '../config/redis.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', async (socket) => {
    try {
      const userId = socket.user._id;
      console.log(`User connected: ${userId}`);

      // Update user status to online
      await User.findByIdAndUpdate(userId, {
        status: 'online',
        isOnline: true,
        socketId: socket.id,
        lastSeen: null
      });

      // Notify others about this user's online status
      socket.broadcast.emit('userStatusChanged', {
        _id: userId,
        status: 'online',
        isOnline: true,
        lastSeen: null
      });

      // Store connection in Redis for horizontal scaling
      if (redis.client) {
        await redis.client.set(`user:${userId}`, socket.id);
      }

      // Handle disconnection
      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${userId}`);
        
        const user = await User.findByIdAndUpdate(userId, {
          status: 'offline',
          isOnline: false,
          socketId: null,
          lastSeen: new Date()
        });

        // Notify others about this user's offline status
        socket.broadcast.emit('userStatusChanged', {
          _id: userId,
          status: 'offline',
          isOnline: false,
          lastSeen: new Date()
        });

        // Remove from Redis
        if (redis.client) {
          await redis.client.del(`user:${userId}`);
        }
      });

      // Handle typing events
      socket.on('typing', ({ conversationId }) => {
        socket.to(conversationId).emit('typing', {
          userId,
          conversationId
        });
      });

      // Handle message events
      socket.on('newMessage', async (message) => {
        // Save message to DB (implement your logic)
        // Then broadcast to conversation participants
        io.to(message.conversationId).emit('newMessage', message);
      });

      // Join conversation rooms
      socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
      });

      // Leave conversation rooms
      socket.on('leaveConversation', (conversationId) => {
        socket.leave(conversationId);
      });

    } catch (error) {
      console.error('Socket connection error:', error);
      socket.disconnect(true);
    }
  });
};