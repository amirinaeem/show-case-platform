// src/services/socketHelpers.js
export const socketNotficationsHandler = (socket, setConnectedUsers) => {
  if (!socket.connected) {
    console.warn('Socket not connected when setting up notifications');
    return () => {};
  }

  const handleInitialUsers = (users) => {
    if (!Array.isArray(users)) {
      console.error('Received invalid users list:', users);
      return;
    }
    setConnectedUsers(users);
    console.log('Initial connected users:', users);
  };

  const onUserConnected = (user) => {
    if (!user?.id) {
      console.error('Invalid user connected:', user);
      return;
    }
    setConnectedUsers(prev => [...(prev || []), user]);
    console.log('User connected:', user.name);
  };

  const onUserDisconnected = (userId) => {
    setConnectedUsers(prev => (prev || []).filter(u => u.id !== userId));
    console.log('User disconnected:', userId);
  };

  // Request current connected users with timeout
  const timeout = setTimeout(() => {
    console.warn('getConnectedUsers response timed out');
  }, 5000);

  socket.emit('getConnectedUsers', (users) => {
    clearTimeout(timeout);
    handleInitialUsers(users);
  });

  // Setup listeners
  socket.on('userConnected', onUserConnected);
  socket.on('userDisconnected', onUserDisconnected);

  // Return cleanup function
  return () => {
    clearTimeout(timeout);
    socket.off('userConnected', onUserConnected);
    socket.off('userDisconnected', onUserDisconnected);
  };
};