import { useState } from 'react';
import { ListGroup, Image, Badge, Form } from 'react-bootstrap';
import { FaSistrix, FaRegCheckCircle } from "react-icons/fa";
import '../../assets/styles/messaging/leftSide.css';

const LeftSide = ({ userInfo, friends, setSelectFriend, isLoading, isCurrentUserOnline }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="left-side pb-5">
      {/* User Profile Header */}
      <div className='top d-flex justify-content-between align-items-center p-3'>
        <div className='d-flex align-items-center'>
  <div className='position-relative me-3'>
  <Image 
    src={userInfo.avatar} 
    alt='User profile' 
    roundedCircle 
    width={50}
    height={50}
    className="align-middle"
  />
  {isCurrentUserOnline && (
    <div className="online-indicator">
      <span className="online-circle"></span>
    </div>
  )}
</div>
          <h5 className='mb-0'>{userInfo.name}</h5>
        </div>
      </div>

      {/* Search Bar */}
      <div className='px-3 py-2'>
        <div className='search d-flex align-items-center bg-light rounded-pill px-3 py-1'>
          <FaSistrix className="text-muted me-2" />
          <Form.Control 
            type="text" 
            placeholder='Search friends...' 
            className='border-0 bg-transparent shadow-none py-1' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Friends List - Remove Active Now section and keep only this */}
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
                className={`friend-item py-3 ${friend.unread ? 'unread' : ''}`}
                onClick={() => setSelectFriend(friend)}
              >
             <div className="d-flex align-items-center">
  <div className="position-relative me-3">
    <Image 
      src={friend.avatar || 'default-avatar.png'} 
      alt={friend.name} 
      roundedCircle 
      width={40}
      height={40}
      className="align-middle"
    />
    {friend.active && (
      <div className="online-indicator">
        <span className="online-circle"></span>
      </div>
    )}
  </div>

  <div className="flex-grow-1 d-flex flex-column justify-content-center">
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <h6 className={`mb-0 ${friend.unread ? 'fw-bold' : ''}`}>
          {friend.name}
        </h6>
        
      </div>
      <div className="d-flex align-items-center">
        <small className={`text-muted ${friend.unread ? 'fw-bold' : ''}`}>
          {friend.lastMessageTime}
        </small>
        {friend.unread ? (
          <Badge pill bg="primary" className="ms-2" />
        ) : (
          <FaRegCheckCircle className="text-muted ms-2" />
        )}
      </div>
    </div>

    <div className="d-flex justify-content-between align-items-center">
      <p className={`mb-0 text-truncate ${friend.unread ? 'fw-bold' : ''}`} style={{ maxWidth: '70%' }}>
        {friend.lastMessage && (
          <>
            <span className="text-muted">
              {friend.lastMessage.sender === userInfo.name ? 'You: ' : ''}
            </span>
            {friend.lastMessage.text}
          </>
        )}
      </p>
    </div>
  </div>
            </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default LeftSide;