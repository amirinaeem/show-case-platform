
import { io } from 'socket.io-client'; // ✅ correct for frontend
import { toast } from 'react-toastify';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export const connectSocket = (token) => {
  if (socket) return socket;

  socket = io(process.env.REACT_APP_API_URL, {
    auth: { token },
    withCredentials: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    reconnectAttempts = 0;
    console.log('✅ Socket connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('⚠️ Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.connect(); // manually reconnect
    }
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      toast.error('Connection failed. Please refresh the page.');
    }
    reconnectAttempts++;
  });

  socket.on('reconnect_failed', () => {
    toast.error('Unable to connect to server. Please check your network connection.');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket || !socket.connected) {
    throw new Error('Socket not connected. Call connectSocket() first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.off();
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
};

export const setupSocketEvents = (handlers = {}) => {
  if (!socket) return;

  const defaultHandlers = {
    onMessage: () => {},
    onTyping: () => {},
    onConversationUpdate: () => {},
    onError: (error) => console.error('Socket error:', error),
  };

  const {
    onMessage,
    onTyping,
    onConversationUpdate,
    onError,
  } = { ...defaultHandlers, ...handlers };

  socket.on('newMessage', onMessage);
  socket.on('typing', onTyping);
  socket.on('conversationUpdated', onConversationUpdate);
  socket.on('error', onError);

  return () => {
    socket.off('newMessage', onMessage);
    socket.off('typing', onTyping);
    socket.off('conversationUpdated', onConversationUpdate);
    socket.off('error', onError);
  };
};
