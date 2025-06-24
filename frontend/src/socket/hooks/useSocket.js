// src/hooks/useSocket.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { socket } from '../services/socket';

export const useSocket = () => {
    
    const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?._id) {
      
      socket.auth = { userInfo };
      socket.connect();
    }

    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [userInfo]); // Reconnect if user ID changes

  return socket;
};