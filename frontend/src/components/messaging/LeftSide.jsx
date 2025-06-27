import { useState } from 'react';
import { ListGroup, Image, Badge, Stack, Form } from 'react-bootstrap';
import { FaSistrix, FaRegCheckCircle, FaCircle } from "react-icons/fa";
import '../../assets/styles/messaging/leftSide.css';

const LeftSide = ({ userInfo, friends, setSelectFriend, isLoading, connectedUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="left-side pb-5">
      <div className='top d-flex justify-content-between align-items-center'>
        <div className='image-name d-flex align-items-center'>
          <div className='position-relative'>
            <Image 
              src={userInfo.avatar} 
              alt='user' 
              roundedCircle 
              width="40"
              height="40"
              className="me-2"
            />
            {connectedUsers.some(user => user.userId === userInfo._id) && (
              <Badge pill bg="success" className="active-badge">
                <FaCircle className="active-icon" />
              </Badge>
            )}
          </div>
          <h5 className='mb-0'>{userInfo.name}</h5>
        </div>
      </div>

      <div className='friend-search px-3 py-2'>
        <div className='search d-flex align-items-center bg-light rounded-pill px-3'>
          <FaSistrix className="text-muted me-2" />
          <Form.Control 
            type="text" 
            placeholder='Search friends...' 
            className='border-0 bg-transparent shadow-none' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className='active-users-section px-3 py-2 bg-light'>
        <h6 className='text-muted mb-3'>Active Now</h6>
        <div className='active-users-list d-flex'>
          {friends
            .filter(friend => friend.active)
            .slice(0, 8)
            .map(friend => (
              <div 
                key={friend._id} 
                className="active-user-item position-relative mx-1"
                onClick={() => setSelectFriend(friend)}
              >
                <Image 
                  src={friend.avatar} 
                  alt={friend.name}
                  roundedCircle
                  width="40"
                  height="40"
                />
                <Badge pill bg="success" className="active-indicator" />
              </div>
            ))}
        </div>
      </div>

      <div className='friends-list-container'>
        <h6 className='text-muted px-3 py-2 mb-0'>All Conversations</h6>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <ListGroup variant="flush" className="friends-list">
            {filteredFriends.map((friend) => (
              <ListGroup.Item 
                key={friend._id}
                action 
                className={`friend-item ${friend.unread ? 'unread' : ''}`}
                onClick={() => setSelectFriend(friend)}
                active={false}
              >
                <Stack direction="horizontal" gap={3} className="align-items-center">
                  <div className="position-relative">
                    <Image 
                      src={friend.avatar || 'default-avatar.png'} 
                      alt={friend.name} 
                      roundedCircle 
                      width="50"
                      height="50"
                      className="friend-avatar"
                    />
                    {friend.active && (
                      <Badge pill bg="success" className="active-badge">
                        <FaCircle className="active-icon" />
                      </Badge>
                    )}
                  </div>

                  <Stack className="friend-details flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className={`friend-name mb-0 ${friend.unread ? 'fw-bold' : ''}`}>
                        {friend.name}
                      </h5>
                      <small className={`message-time ${friend.unread ? 'fw-bold' : ''}`}>
                        {friend.lastMessageTime}
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className={`last-message mb-0 text-truncate ${friend.unread ? 'fw-bold' : ''}`}>
                        {friend.lastMessage && (
                          <>
                            <span className="you-label">
                              {friend.lastMessage.sender === userInfo.name ? 'You: ' : ''}
                            </span>
                            {friend.lastMessage.text}
                          </>
                        )}
                      </p>
                      <div className="message-status">
                        {friend.unread ? (
                          <Badge pill bg="primary" className="unread-badge" />
                        ) : (
                          <FaRegCheckCircle className="read-icon text-muted" />
                        )}
                      </div>
                    </div>
                  </Stack>
                </Stack>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default LeftSide;