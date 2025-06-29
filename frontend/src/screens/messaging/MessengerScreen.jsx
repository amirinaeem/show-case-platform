import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import LeftSide from '../../components/messaging/LeftSide';
import RightSide from '../../components/messaging/RightSide';
import Messenger from '../../components/messaging/Messenger';
import { useGetFriendsQuery } from '../../slices/messengerSlice';
import { useSocket } from '../../socket/hooks/useSocket';
import { socketNotficationsHandler } from '../../socket/helper/notificationsHandler';
import '../../assets/styles/messaging/messengerScreen.css';

const MessengerScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const socket = useSocket();
  const { data: friends = [], isLoading } = useGetFriendsQuery();

  const [selectFriend, setSelectFriend] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socketReady, setSocketReady] = useState(false);
  const [showChatColumns, setShowChatColumns] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);
  const [showRight, setShowRight] = useState(false);


  console.log('connected users from messenger Screen', connectedUsers)

  const handleSelectFriend = (friend) => {
    setSelectFriend(friend);
    setShowChatColumns(true);
  };

  
  useEffect(() => {
    if (showChatColumns) {
      setTimeout(() => setShowMessenger(true), 100);
      setTimeout(() => setShowRight(true), 400);
    }
  }, [showChatColumns]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setSocketReady(true);
    const handleDisconnect = () => setSocketReady(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !socketReady) return;
    return socketNotficationsHandler(socket, setConnectedUsers);
  }, [socket, socketReady]);

  const enhancedFriends = useMemo(() => {
  if (!friends || !connectedUsers) return [];

  return friends
    .filter((friend) => friend._id !== userInfo._id)
    .map((friend) => ({
      ...friend,
      active: connectedUsers.some((user) => user.id === friend._id),
    }))
    .sort((a, b) => {
      if (a.active && !b.active) return -1;
      if (!a.active && b.active) return 1;
      return a.name.localeCompare(b.name);
    });
}, [friends, connectedUsers, userInfo._id]);


const isCurrentUserOnline = connectedUsers.some(user => user.id === userInfo._id);

  return (
    <div className="messenger-screen">
      <div className="messenger-layout">
        <div className={`left-column ${showChatColumns ? 'shrink' : ''}`}>
          <LeftSide
            userInfo={userInfo}
            friends={enhancedFriends}
            setSelectFriend={handleSelectFriend}
            isLoading={isLoading}
            connectedUsers={connectedUsers}
            isCurrentUserOnline={isCurrentUserOnline}
          />
        </div>

        <div className={`messenger-column ${showMessenger ? 'expand' : ''}`}>
          {showMessenger && (
            <Messenger
              selectFriend={selectFriend}
              userInfo={userInfo}
              connectedUsers={connectedUsers}

            />
          )}
        </div>

        <div className={`right-column ${showRight ? 'expand' : ''}`}>
          {showRight && (
            <RightSide
              selectFriend={selectFriend}
              connectedUsers={connectedUsers}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessengerScreen;
