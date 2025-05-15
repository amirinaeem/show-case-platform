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
import { useConnectSocket } from '../../utils/useSocket';
import '../../assets/styles/messenger.css';

function MessengerScreen() {
  const [showChat1, setShowChat1] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const textareaRef = useRef(null);

  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const { socket } = useConnectSocket();

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (updatedUser) => {
      refetch();
    };

    socket.on('userStatusChanged', handleStatusUpdate);

    return () => {
      socket.off('userStatusChanged', handleStatusUpdate);
    };
  }, [socket, refetch]);

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
                {users.map((user) => (
                  <li key={user._id} onClick={() => handleUserClick(user)}>
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
                        <p>{user.isOnline ? 'Online' : `Last seen ${user.lastSeen || 'recently'}`}</p>
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
                  <p>{selectedUser?.isOnline ? 'Online' : 'Offline'}</p>
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