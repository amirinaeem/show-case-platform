import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { connectSocket, disconnectSocket } from './clientSocket';

export const useConnectSocket = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userInfo?.token || !userInfo?._id) return;

    const socketInstance = connectSocket(userInfo.token);
    setSocket(socketInstance);

    const handleConnect = () => {
      socketInstance.emit('user-connected', { userId: userInfo._id });
      console.log('✅ Socket connected and emitted user-connected:', socketInstance.id);
    };

    socketInstance.on('connect', handleConnect);

    return () => {
      socketInstance.off('connect', handleConnect);
      disconnectSocket();
    };
  }, [userInfo?.token, userInfo?._id]); 

  return socket;
};
