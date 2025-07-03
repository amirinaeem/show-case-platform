import { socketLogger } from '../socketUtils/logger.js';
import { registerMessageHandlers } from './registerMessageHandlers.js';
import { addOnlineUser, removeOnlineUser, getAllOnlineUsers } from '../store/redisUserStore.js';

export const registerUserHandlers = async (io, socket) => {
  const { userInfo } = socket.handshake.auth;

  if (!userInfo || !userInfo._id) {
    socketLogger.handlerError(socket.id, new Error('Invalid userInfo - Missing _id'));
    socket.disconnect(true);
    return;
  }

  const userData = {
    id: userInfo._id,
    name: userInfo.name,
    email: userInfo.email,
  };

  socket.userData = userData;

  await addOnlineUser(userData);

  socketLogger.networkEvent('User authenticated', socket.id,
    `(User: ${userInfo.name}, ID: ${userInfo._id})`);

  // Notify others about new connection
  socket.broadcast.emit('userConnected', userData);

  registerMessageHandlers(io, socket);

  // Handle request to get online users from Redis
  socket.on('getConnectedUsers', async (callback) => {
    const users = await getAllOnlineUsers();
    callback(users);
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    await removeOnlineUser(userData.id);
    io.emit('userDisconnected', userData.id);
  });
};
