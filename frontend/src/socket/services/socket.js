// frontend/src/config/socket.js
import { io } from 'socket.io-client';

// Always pull from .env (React will inline REACT_APP_* at build time)
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
});

// Debug logs only in development
if (process.env.NODE_ENV === 'development') {
  socket
    .on('connect', () => console.log('✅ Socket connected:', socket.id))
    .on('disconnect', (reason) => console.log('❌ Socket disconnected:', reason))
    .on('connect_error', (err) => console.log('⚠️ Connection error:', err.message));
}
