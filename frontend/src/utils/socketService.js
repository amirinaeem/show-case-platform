// features/messaging/socketService.js
import { io } from 'socket.io-client';

let socket;

export const connectSocket = (token) => {
  socket = io(process.env.REACT_APP_API_URL, {
    auth: { token },
    withCredentials: true
  });
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not connected');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};