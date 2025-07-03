// socketControllers/messageHandlers.js
import Message from '../../../shared/src/models/messengerModel.js';

export const registerMessageHandlers = (io, socket) => {
  // Handle incoming messages
  socket.on('newMessage', async ({ message, to }) => {
    try {
      const recipientSocket = [...io.sockets.sockets.values()].find(
        s => s.userData?.id === to
      );

      if (recipientSocket) {
        recipientSocket.emit('messageReceived', message);
      }


    } catch (err) {
      console.error('Socket newMessage error:', err);
    }
  });

  // Add more messaging events here (typing, seen, etc.)
};
