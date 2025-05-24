import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faVideo, 
  faPhone, 
  faEllipsisV, 
  faUserCircle, 
  faUsers, 
  faPlus, 
  faBan, 
  faPaperclip, 
  faLocationArrow 
} from '@fortawesome/free-solid-svg-icons';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import { useConnectSocket } from '../../sockets/useConnectSocket';
import '../../assets/styles/messenger.css';

function MessengerScreen() {

  const [showChat1, setShowChat1] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const textareaRef = useRef(null);

  // Fetch initial users data
  const { data: initialUsers = [], isLoading, isError } = useGetUsersQuery();

  console.log(initialUsers, 'data from query')
  
  const socket = useConnectSocket();

  console.log('Socket connected successuly', socket)

  
useEffect(() => {
  if (initialUsers.length) {
    setUsersList(initialUsers.map(user => ({
      ...user,
      isOnline: user.isOnline || false,  // Ensure isOnline exists
      lastSeen: user.lastSeen 
        ? new Date(user.lastSeen).toLocaleString() 
        : 'recently'
    })));
  }
}, [initialUsers]);

  // Handle real-time status updates
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = ({ userId: _id, isOnline, lastSeen }) => {
      console.log(isOnline);

      setUsersList(prevUsers => 
        prevUsers.map(user => 
          user._id === _id
            ? { 
                ...user, 
                isOnline, 
                lastSeen: lastSeen ? new Date(lastSeen).toLocaleString() : 'recently' 
              } 
            : user
        )
      );

      // Update selected user if they're the one who changed status
      setSelectedUser(prev => 
        prev?._id === _id 
          ? { 
              ...prev, 
              isOnline, 
              lastSeen: lastSeen ? new Date(lastSeen).toLocaleString() : 'recently' 
            } 
          : prev
      );
    };

    socket.on('userStatusChange', handleStatusUpdate);
    socket.on('error', (err) => console.error('Socket error:', err));

    return () => {
      socket.off('userStatusChange', handleStatusUpdate);
      socket.off('error');
    };
  }, [socket]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowChat1(false);
  };

  const toggleActionMenu = () => setShowActionMenu(!showActionMenu);
  const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  const handleEmojiClick = (emojiData) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBefore = message.substring(0, cursorPosition);
    const textAfter = message.substring(cursorPosition);
    
    setMessage(textBefore + emojiData.emoji + textAfter);
    
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = cursorPosition + emojiData.emoji.length;
      textareaRef.current.selectionEnd = cursorPosition + emojiData.emoji.length;
    }, 0);
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen || lastSeen === 'recently') return 'recently';
    return new Date(lastSeen).toLocaleString();
  };

  if (isLoading) return <div className="loading">Loading users...</div>;
  if (isError) return <div className="error">Error loading users</div>;

  return (
    <div className="messenger">
      <div className="row justify-content-center h-100">
        <div className={`chat-1 ${showChat1 ? '' : 'd-none'}`}>
          <div className="card mb-sm-3 mb-md-0 contacts_card">
            <div className="card-header">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control search"
                />
                <div className="input-group-prepend">
                  <span className="input-group-text search_btn">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body contacts_body">
              <ul className="contacts">
                {usersList.map((user) => (
                  <li key={user.userId} onClick={() => handleUserClick(user)}>
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        <img
                          src={user.avatar || 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'}
                          className="rounded-circle user_img"
                          alt={`${user.name} profile`}
                        />
                        <span className={`online_icon ${user.isOnline ? 'online' : 'offline'}`} />
                      </div>
                      <div className="user_info">
                        <span>{user.name}</span>
                        <p>{user.isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer" />
          </div>
        </div>

        <div className={`chat-2 ${!showChat1 ? '' : 'd-none'}`}>
          <div className="card">
            <div className="card-header msg_head">
              <div className="d-flex bd-highlight header-icons">
                <div className="img_cont">
                  <img
                    src={selectedUser?.avatar || 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'}
                    className="rounded-circle user_img"
                    alt={`${selectedUser?.name} profile`}
                  />
                  <span className={`online_icon ${selectedUser?.isOnline ? 'online' : 'offline'}`} />
                </div>
                <div className="user_info">
                  <span>{selectedUser?.name || 'User'}</span>
                  <p>{selectedUser?.isOnline ? 'Online' : `Last seen ${formatLastSeen(selectedUser?.lastSeen)}`}</p>
                </div>
                <div className="video_cam">
                  <span><FontAwesomeIcon icon={faVideo} /></span>
                  <span><FontAwesomeIcon icon={faPhone} /></span>
                  <span onClick={toggleActionMenu}>
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </span>
                </div>
              </div>
              
              {showActionMenu && (
                <div className="action_menu">
                  <ul>
                    <li><FontAwesomeIcon icon={faUserCircle} /> View profile</li>
                    <li><FontAwesomeIcon icon={faUsers} /> Add to close friends</li>
                    <li><FontAwesomeIcon icon={faPlus} /> Add to group</li>
                    <li><FontAwesomeIcon icon={faBan} /> Block</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="card-body msg_card_body">
              {/* Message content would go here */}
              <div className="d-flex justify-content-start mb-4">
                <div className="img_cont_msg">
                  <img
                    src={selectedUser?.avatar || 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'}
                    className="rounded-circle user_img_msg"
                    alt={`${selectedUser?.name} profile`}
                  />
                </div>
                <div className="msg_cotainer">
                  Hi, how are you?
                  <span className="msg_time">8:40 AM, Today</span>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <div className="input-group">
                <div className="emoji-picker-container">
                  <button className="emoji-btn" onClick={toggleEmojiPicker}>
                    <span role="img" aria-label="emoji">😊</span>
                  </button>
                  {showEmojiPicker && (
                    <div className="emoji-picker-wrapper">
                      <EmojiPicker 
                        onEmojiClick={handleEmojiClick}
                        width={300}
                        height={350}
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  )}
                </div>
                <textarea
                  ref={textareaRef}
                  name="message"
                  className="form-control type_msg"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="input-group-append">
                  <span className="input-group-text attach_btn">
                    <FontAwesomeIcon icon={faPaperclip} />
                  </span>
                  <span className="input-group-text send_btn">
                    <FontAwesomeIcon icon={faLocationArrow} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessengerScreen;