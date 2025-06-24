import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://yourdomain.com' 
  : 'ws://localhost:8000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket']
});

// Enhanced debugging
if (process.env.NODE_ENV === 'development') {
  socket
    .on('connect', () => console.log('✅ Socket connected:', socket.id))
    .on('disconnect', (reason) => console.log('❌ Socket disconnected:', reason))
    .on('connect_error', (err) => console.log('⚠️ Connection error:', err.message));
}