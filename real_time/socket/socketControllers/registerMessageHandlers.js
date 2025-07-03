// socketControllers/messageHandlers.js

export const registerMessageHandlers = (io, socket) => {
  // Handle incoming messages
  socket.on('newMessage', async ({ message, to }) => {
    try {
      const recipientSocket = [...io.sockets.sockets.values()].find(
        s => s.userData?.id === to
      );

      const senderSocket = socket;

      if (recipientSocket) {
        recipientSocket.emit('messageReceived', message);
      }


      senderSocket.emit('messageReceived', message)


    } catch (err) {
      console.error('Socket newMessage error:', err);
    }
  });

  // Add more messaging events here (typing, seen, etc.)
};
