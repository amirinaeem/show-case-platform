// socketControllers/messageHandlers.js
export const registerMessageHandlers = (io, socket) => {
  console.log(`New connection from socket ${socket.id}, user: ${socket.userData?.id}`);

  // Handle messaging
  socket.on('newMessage', async ({ message, to, from }) => {
    try {
      console.log(`New message from ${from} to ${to}`);
      
      const recipientSocket = [...io.sockets.sockets.values()].find(
        s => s.userData?.id === to
      );
      
      const senderSocket = [...io.sockets.sockets.values()].find(
        s => s.userData?.id === from
      );

      if (recipientSocket) {
        console.log(`Emitting message to recipient ${to}`);
        recipientSocket.emit('messageReceived', message);
      }
      
      if (senderSocket && to !== from) {
        console.log(`Emitting message back to sender ${from}`);
        senderSocket.emit('messageReceived', message);
      }

    } catch (err) {
      console.error('Socket newMessage error:', err);
    }
  });

  // Handle typing indicator
  socket.on('typingStart', ({ to, from }) => {
    console.log(`Typing start from ${from} to ${to}`);
    const recipientSocket = [...io.sockets.sockets.values()].find(
      s => s.userData?.id === to
    );
    
    if (recipientSocket) {
      console.log(`Emitting typingStart to ${to}`);
      recipientSocket.emit('typingStart', { from });
    }
  });

  // Handle stop typing
  socket.on('typingStop', ({ to, from }) => {
    console.log(`Typing stop from ${from} to ${to}`);
    const recipientSocket = [...io.sockets.sockets.values()].find(
      s => s.userData?.id === to
    );
    
    if (recipientSocket) {
      console.log(`Emitting typingStop to ${to}`);
      recipientSocket.emit('typingStop', { from });
    }
  });
};