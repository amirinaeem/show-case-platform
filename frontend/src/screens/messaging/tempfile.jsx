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




//
/* Chat container layout */
.messenger {
  border: 0;
  box-sizing: border-box;
  border-radius: 15px;
  max-height: 800px;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.row.justify-content-center.h-100 {
  height: 100%;
  margin: 0;
}

.chat-1, .chat-2 {
  width: 600px;
  height: 800px;
  border-radius: 15px;
}

/* Cards styling */
.messenger .card {
  border-radius: 15px !important;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: none;
  margin: 0;
}

/* Contacts list styling */
.messenger .contacts_body {
  padding: 0.75rem 0 !important;
  overflow-y: scroll;
  white-space: nowrap;
  flex: 1;
  background-color: transparent rgb(196, 219, 211);
}

/* Message area styling */
.messenger .msg_card_body {
  flex: 1;
  overflow-y: scroll;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: transparent !important;
  height: calc(100vh - 200px);
}

.header-icons {
  display: flex;
  width: 100%;
  align-items: center;
  color: white;
}

/* Header and footer styling */
.messenger .card-header {
  border-radius: 15px 15px 0 0 !important;
  border-bottom: 0 !important;
  background-color: rgb(142, 142, 235);
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  position: relative;
}

.video_cam {
  display: flex;
  gap: 15px;
  align-items: center;
}

.messenger .card-footer {
  border-radius: 0 0 15px 15px !important;
  border-top: 0 !important;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.1);
}

/* Footer input group styling */
.messenger .input-group {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
}

.messenger .input-group-text {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
}

/* Emoji button styling */
.emoji-btn {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 15px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Search input styling */
.messenger .search {
  border-radius: 15px 0 0 15px !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
}

.messenger .search:focus,
.messenger .type_msg:focus {
  box-shadow: none !important;
  outline: 0px !important;
}

/* Message input styling */
.messenger .type_msg {
  background-color: rgba(221, 207, 207, 0.3) !important;
  border: 0 !important;
  resize: none;
  min-height: 50px;
  max-height: 200px;
  margin-bottom: 10px;
  flex: 1;
  border-radius: 15px !important;
  padding: 10px 15px;
}

.input-group-append {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}

/* Button styling */
.messenger .attach_btn,
.messenger .send_btn,
.messenger .search_btn {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
  padding: 10px 15px;
}

.messenger .attach_btn,
.messenger .send_btn {
  border-radius: 15px !important;
}

.messenger .search_btn {
  border-radius: 0 15px 15px 0 !important;
}

/* Contacts list styling */
.messenger .contacts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.messenger .contacts li {
  width: 100% !important;
  padding: 10px;
  margin-bottom: 5px !important;
  cursor: pointer;
  transition: background-color 0.2s;
}

.messenger .contacts li:hover,
.messenger .contacts li.active {
  background-color: rgba(0, 0, 0, 0.3);
}

/* User images styling */
.messenger .user_img {
  height: 50px;
  width: 50px;
  border: 1.5px solid #f5f6fa;
  border-radius: 50%;
  object-fit: cover;
}

.messenger .user_img_msg {
  height: 40px;
  width: 40px;
  border: 1.5px solid #f5f6fa;
  border-radius: 50%;
  object-fit: cover;
}

/* Online status indicator */
.messenger .online_icon {
  position: absolute;
  height: 12px;
  width: 12px;
  background-color: #4cd137;
  border-radius: 50%;
  bottom: 5px;
  right: 5px;
  border: 1.5px solid white;
}

.messenger .offline {
  background-color: #c23616 !important;
}

/* Message bubbles */
.messenger .msg_cotainer,
.messenger .msg_cotainer_send {
  margin-top: auto;
  margin-bottom: auto;
  border-radius: 25px;
  padding: 10px 15px;
  position: relative;
  max-width: 70%;
  word-wrap: break-word;
}

.messenger .msg_cotainer {
  margin-left: 10px;
  background-color: #82ccdd;
}

.messenger .msg_cotainer_send {
  margin-right: 10px;
  background-color: #78e08f;
}

/* Message time styling */
.messenger .msg_time,
.messenger .msg_time_send {
  position: absolute;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
  white-space: nowrap;
}

.messenger .msg_time {
  left: 15px;
}

.messenger .msg_time_send {
  right: 15px;
}

/* Action menu styling */
.messenger .action_menu {
  position: absolute;
  right: 15px;
  top: 60px;
  background-color: rgba(236, 229, 230, 0.7);
  border-radius: 5px;
  padding: 5px 0;
  display: block;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.messenger .action_menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 150px;
}

.messenger .action_menu ul li {
  padding: 8px 15px;
  cursor: pointer;
  font-size: 14px;
}

.messenger .action_menu ul li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.messenger .action_menu ul li i {
  margin-right: 10px;
}

/* Show action menu when toggle button is clicked */
.messenger .action-menu-toggle:focus + .action_menu,
.messenger .action_menu:hover {
  display: block;
}

/* User info and header alignment */
.user_info {
  flex: 1;
  padding-left: 15px;
}

.user_info span {
  display: block;
  font-weight: bold;
}

.user_info p {
  margin: 0;
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.7);
}

/* Video call styles */
.video-call-container,
.call-overlay {
  position: fixed;
  z-index: 9999;
}

.video-call-container {
  bottom: 1rem;
  right: 1rem;
  background: black;
  padding: 0.5rem;
  border-radius: 8px;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
}

.call-overlay {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.local-video, 
.remote-video {
  background: black;
  border-radius: 8px;
  object-fit: cover;
}

.video-call-container .local-video,
.video-call-container .remote-video {
  width: 200px;
  height: 150px;
}

.call-container .remote-video {
  width: 100%;
  height: 100%;
}

.call-container .local-video {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 150px;
  height: 100px;
  border: 2px solid #fff;
}

/* Call controls */
.call-container {
  width: 80%;
  max-width: 800px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  position: relative;
}

.video-container {
  position: relative;
  width: 100%;
  height: 500px;
  background: #000;
  border-radius: 5px;
  overflow: hidden;
}

.call-controls,
.call-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.end-call-btn,
.accept-btn,
.decline-btn {
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
}

.end-call-btn,
.decline-btn {
  background: #ff4d4d;
}

.accept-btn {
  background: #4CAF50;
}

.incoming-call {
  text-align: center;
  padding: 30px;
}

/* Message styles */
.incoming {
  background: #f1f1f1;
  color: #000;
  margin-left: 10px;
  border-top-left-radius: 0;
}

.outgoing {
  background: #007bff;
  color: white;
  margin-right: 10px;
  border-top-right-radius: 0;
}

.message-reactions {
  position: absolute;
  bottom: -15px;
  right: 5px;
  background: white;
  border-radius: 10px;
  padding: 2px 5px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  padding: 10px;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background: #999;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.5s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}

/* Emoji picker */
.emoji-picker-container {
  position: relative;
}

.emoji-picker-wrapper {
  position: absolute;
  bottom: 40px;
  left: 0;
  z-index: 100;
}

/* User list */
.user-list img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.user-list ul {
  list-style: none;
  padding: 0;
}

.user-list li {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-list li:hover {
  background-color: #f0f0f0;
}

.user-list span {
  font-size: 16px;
  font-weight: 500;
}

/* Flex utilities */
.d-flex {
  display: flex;
}

.bd-highlight {
  align-items: center;
}

.img_cont {
  position: relative;
  flex-shrink: 0;
}

.img_cont_msg {
  position: relative;
  flex-shrink: 0;
  align-self: flex-end;
  margin: 0 5px;
}

.justify-content-start {
  justify-content: flex-start;
}

.justify-content-end {
  justify-content: flex-end;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

/* Scrollbar styling */
.messenger ::-webkit-scrollbar {
  width: 5px;
}

.messenger ::-webkit-scrollbar-track {
  background: rgba(241, 241, 241, 0.1);
}

.messenger ::-webkit-scrollbar-thumb {
  background: rgba(136, 136, 136, 0.5);
}

.messenger ::-webkit-scrollbar-thumb:hover {
  background: rgba(85, 85, 85, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .messenger {
    padding: 0, 20px;
    padding-left: 40px;
    width: 100vw;
    height: 100vh;
  }
  
  .messenger .card-header {
    padding: 8px 10px;
  }
  
  .messenger .user_img {
    height: 40px;
    width: 40px;
  }
  
  .messenger .user_img_msg {
    height: 30px;
    width: 30px;
  }
  
  .video_cam {
    gap: 10px;
  }
  
  .messenger .msg_cotainer,
  .messenger .msg_cotainer_send {
    max-width: 80%;
    padding: 8px 12px;
  }
  
  .messenger .type_msg {
    min-height: 40px;
  }
}

@media (max-width: 480px) {
  .messenger .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-icons {
    flex-wrap: wrap;
  }
  
  .video_cam {
    width: 100%;
    justify-content: flex-end;
    margin-top: 5px;
  }
  
  .messenger .msg_cotainer,
  .messenger .msg_cotainer_send {
    max-width: 90%;
  }
}