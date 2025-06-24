import { socketLogger } from '../socketUtils/logger.js';

export const registerUserHandlers = (io, socket) => {
  const { userInfo } = socket.handshake.auth;

  if (!userInfo || !userInfo._id) {
    socketLogger.handlerError(socket.id, new Error('Invalid userInfo - Missing _id'));
    socket.disconnect(true);
    return;
  }

  // Create user data object
  const userData = {
    id: userInfo._id,
    name: userInfo.name,
    email: userInfo.email
  };
  
  // Attach to socket
  socket.userData = userData;
  socketLogger.networkEvent('User authenticated', socket.id, 
    `(User: ${userInfo.name}, ID: ${userInfo._id})`);

  // Notify others about new connection
  socket.broadcast.emit('userConnected', userData);

  // Handle user list requests
  socket.on('getConnectedUsers', (callback) => {
    const users = getConnectedUsers(io);
    callback(users);
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    socketLogger.disconnect(socket.id, `${reason} | User: ${userInfo.name}`);
    io.emit('userDisconnected', userData.id);
  });
};

// Helper function to get all connected users
function getConnectedUsers(io) {
  return Array.from(io.sockets.sockets.values())
    .map(s => s.userData)
    .filter(Boolean);
}