import { ListGroup, Image, Badge, Stack, Form, Button } from 'react-bootstrap';


import { 
  FaEllipsisH, 
  FaEdit, 
  FaSistrix, 
  FaSignOutAlt,
  FaRegCheckCircle,
  FaCircle
} from "react-icons/fa";
import '../../assets/styles/messaging/leftSide.css';


const LeftSide = ({userInfo, friends, setSelectFriend}) => {
 

  return (
    <div className="left-side">
      {/* User Profile Section */}
      <div className='top d-flex justify-content-between align-items-center m-2'>
        <div className='image-name d-flex align-items-center'>
          <div className='image'>
            <img src={userInfo.avatar} alt='user' />
          </div>
          <div className='name'>
            <h3>{userInfo.name}</h3>
          </div>
        </div>

        <div className='icons d-flex position-relative'>
          <div className='icon'><FaEllipsisH /></div>
          <div className='icon'><FaEdit /></div>

          <div className='theme_logout'>
            <h3>Dark Mode</h3>
            <div className='on d-flex justify-content-between mt-2'>
              <label htmlFor='dark'>ON</label>
              <input type="radio" value="dark" name="theme" id="dark" />
            </div>
            <div className='of d-flex justify-content-between mt-2'>
              <label htmlFor='white'>OFF</label>
              <input type="radio" value="white" name="theme" id="white" />
            </div>
            <div className='logout d-flex align-items-center mt-2'>
              <FaSignOutAlt /> Logout
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className='friend-search px-2'>
        <div className='search d-flex align-items-center'>
          <Button variant="link" className="p-0 text-dark"><FaSistrix /></Button>
          <Form.Control 
            type="text" 
            placeholder='Search' 
            className='form-control' 
          />
        </div>
      </div>

      {/* Friends List Section */}
        <div className='friends-list-container'>
        <ListGroup variant="flush" className="friends-list">
          {friends.map((friend, index) => (
            <ListGroup.Item 
              key={friend._id || index} // Use friend._id if available
              action 
              className={`friend-item ${friend.unread ? 'unread' : ''}
              `}
              onClick={() => setSelectFriend(friend)}
            >
              <Stack direction="horizontal" gap={3} className="align-items-center">
                {/* Friend Avatar with Active Status */}
                <div className="position-relative">
                  <Image 
                    src={friend.avatar || 'SHCAPL-logo.jpg'} 
                    alt="friend profile" 
                    roundedCircle 
                    className="friend-avatar"
                  />
                  {friend.active && (
                    <Badge pill bg="success" className="active-badge">
                      <FaCircle className="active-icon" />
                    </Badge>
                  )}
                </div>

                {/* Friend Name and Message */}
                <Stack className="friend-details">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className={`friend-name mb-0 ${friend.unread ? 'fw-bold' : ''}`}>
                      {friend.name}
                    </h5>
                    <span className={`message-time ${friend.unread ? 'fw-bold' : ''}`}>
                      {friend.lastMessageTime}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className={`last-message mb-0 ${friend.unread ? 'fw-bold' : ''}`}>
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
                        <FaRegCheckCircle className="read-icon" />
                      )}
                    </div>
                  </div>
                </Stack>
              </Stack>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default LeftSide;