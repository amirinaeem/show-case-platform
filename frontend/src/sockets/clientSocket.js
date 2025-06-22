// ✅ clientSocket.js
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

let socket = null;
const MAX_RECONNECT_ATTEMPTS = 5;
let reconnectAttempts = 0;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
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
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.warn('⚠️ Socket disconnected:', reason);
    if (reason === 'io server disconnect') socket.connect();
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket error:', error.message);
    if (++reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      toast.error('Failed to connect to server.');
    }
  });

  socket.on('reconnect_failed', () => {
    toast.error('Reconnection failed. Check connection.');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.off();
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
    console.log('🔌 Socket fully disconnected');
  }
};

export const getSocket = () => {
  if (!socket?.connected) throw new Error('Socket not connected.');
  return socket;
};

export const setupSocketEvents = (handlers = {}) => {
  if (!socket) return () => {};
  const cleanups = Object.entries(handlers).map(([event, handler]) => {
    socket.on(event, handler);
    return () => socket.off(event, handler);
  });
  return () => cleanups.forEach((cleanup) => cleanup());
};