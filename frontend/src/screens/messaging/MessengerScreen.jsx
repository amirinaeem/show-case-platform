import '../../assets/styles/messaging/messengerScreen.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import LeftSide from '../../components/messaging/LeftSide';
import RightSide from '../../components/messaging/RightSide';
import Messenger from '../../components/messaging/Messenger';
import { useGetFriendsQuery } from '../../slices/messengerSlice';

const MessengerScreen = () => {

   // User data
  const { data: friends = [],
    isLoading,
    error
  } = useGetFriendsQuery();


  const { userInfo } = useSelector(state => state.auth);

  console.log(userInfo, 'userInfo is exist from leftside messenger component')

  useEffect(() => {
    console.log('Friends data:', friends);
    if (error) console.log('Error fetching friends', error)
  }, [friends, isLoading, error]);
  
  //end of user data fetching functionality

  //selecting friend for chat
  const [selectFriend, setSelectFriend] = useState('')
  

  return (
    <Container fluid className="messenger">
      <Row className="h-100">
        <Col md={3}>
          <LeftSide
            userInfo={userInfo}
            friends={friends}
            setSelectFriend={setSelectFriend}
          />
        </Col>
        <Col md={6}>
           {selectFriend ? <Messenger
            selectFriend ={selectFriend}
          /> : 'Please select someone for chat'}
        </Col>
        <Col md={3}>
          <RightSide
            selectFriend={selectFriend}
            userInfo = {userInfo}
          />
        </Col>
      </Row>
    </Container>
  );
};



export default MessengerScreen;
