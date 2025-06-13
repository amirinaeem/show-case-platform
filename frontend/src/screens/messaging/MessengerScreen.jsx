import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';


import LeftSide from '../../components/messaging/LeftSide';
import RightSide from '../../components/messaging/RightSide';
import Messenger from '../../components/messaging/Messenger';

import {
  useGetFriendsQuery,
} from '../../slices/messengerSlice';

const MessengerScreen = () => {
  
  const { userInfo } = useSelector(state => state.auth);

  const { data: friends = [], isLoading } = useGetFriendsQuery();
  

  const [selectFriend, setSelectFriend] = useState(null);
 


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
            <div className="select-friend-prompt">Please select someone to chat with</div>
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
