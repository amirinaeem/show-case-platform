import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, setupSocketEvents } from './clientSocket';

export const useConnectSocket = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const socket = connectSocket(userInfo?.token);

  useEffect(() => {
    if (!socket) return;

    const cleanup = setupSocketEvents({
      onUserStatusChange: (updatedUser) => {
        // Handle status updates
      },
    }) || (() => {}); // Fallback empty function if cleanup is undefined

    return () => {
      cleanup(); // Now this will always be a function
      if (socket) disconnectSocket();
    };
  }, [socket]);

  return { socket };
};