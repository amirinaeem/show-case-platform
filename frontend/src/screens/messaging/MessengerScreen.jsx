import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { useSocket } from '../../socket/hooks/useSocket';
import { socketNotficationsHandler } from '../../socket/helper/notificationsHandler'; 
import LeftSide from '../../components/messaging/LeftSide';
import RightSide from '../../components/messaging/RightSide';
import Messenger from '../../components/messaging/Messenger';
import { useGetFriendsQuery } from '../../slices/messengerSlice';

const MessengerScreen = () => {
  const { userInfo } = useSelector(state => state.auth);
  const socket = useSocket(); 
  const { data: friends = [], isLoading } = useGetFriendsQuery();
  const [selectFriend, setSelectFriend] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]); // Initialize as empty array
  const [socketReady, setSocketReady] = useState(false);

  // Track socket connection status
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

  // Setup notifications only when socket is ready
  useEffect(() => {
    if (!socket || !socketReady) return;
    
    const cleanup = socketNotficationsHandler(socket, setConnectedUsers);
    return cleanup;
  }, [socket, socketReady]);

  console.log('Socket ready:', socketReady);
  console.log('Current connected users:', connectedUsers);
  

  return (
    <Container fluid className="messenger-screen">
      <Row className="h-100">
        <Col md={3}>
          <LeftSide
            userInfo={userInfo}
            friends={friends}
            setSelectFriend={setSelectFriend}
            isLoading={isLoading}
          />
        </Col>
        <Col md={6}>
          {selectFriend ? (
            <Messenger
              selectFriend={selectFriend}
              userInfo={userInfo}
              
            />
          ) : (
            <div className="select-friend-prompt">
              Please select someone to chat with
            </div>
          )}
        </Col>
        <Col md={3}>
          <RightSide selectFriend={selectFriend} userInfo={userInfo} />
        </Col>
      </Row>
    </Container>
  );
};

export default MessengerScreen;