import React, { useState } from 'react';
import '../../assets/styles/messenger.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVideo, 
  faPhone, 
  faEllipsisV, 
  faUserCircle, 
  faUsers, 
  faPlus, 
  faBan
} from '@fortawesome/free-solid-svg-icons';

import GetConversations from '../../components/messaging/GetConversations';
import GetMessages from '../../components/messaging/GetMessages';
import SendMessages from '../../components/messaging/SendMessages';
import UploadAttachments from '../../components/messaging/UploadAttachments';
import CreateConversations from '../../components/messaging/GreateConversations';

function MessengerScreen() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);

  const toggleActionMenu = () => {
    setShowActionMenu(!showActionMenu);
  };

  const handleNewConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowNewConversation(false);
  };

  return (
    <div className="messenger">
      <div className="row justify-content-center h-100">
        <div className={!selectedConversation ? "chat-1" : "chat-1 d-none"}>
          <div className="d-flex justify-content-end mb-2">
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewConversation(true)}
            >
              New Conversation
            </button>
          </div>
          
          {showNewConversation ? (
            <CreateConversations onConversationCreated={handleNewConversation} />
          ) : (
            <GetConversations setSelectedConversation={setSelectedConversation} />
          )}
        </div>
        
        {selectedConversation && (
          <div className="chat-2">
            <div className="card">
              <div className="card-header msg_head">
                <div className="d-flex bd-highlight header-icons">
                  <div className="img_cont">
                    <img
                      src={selectedConversation.participants[0]?.avatar || 'https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg'}
                      className="rounded-circle user_img"
                      alt={selectedConversation.participants[0]?.name}
                    />
                    <span className="online_icon" />
                  </div>
                  <div className="user_info">
                    <span>{selectedConversation.participants[0]?.name}</span>
                    <p>Online</p>
                  </div>
                  <div className="video_cam">
                    <span>
                      <FontAwesomeIcon icon={faVideo} />
                    </span>
                    <span>
                      <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <span id="action_menu_btn" onClick={toggleActionMenu}>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </span>
                  </div>
                </div>
                
                <div className={`action_menu ${showActionMenu ? '' : 'd-none'}`}>
                  <ul>
                    <li>
                      <FontAwesomeIcon icon={faUserCircle} /> View profile
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faUsers} /> Add to close friends
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faPlus} /> Add to group
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faBan} /> Block
                    </li>
                  </ul>
                </div>
              </div>
              
              <GetMessages conversationId={selectedConversation._id} />
              
              <div className="d-flex">
                <UploadAttachments conversationId={selectedConversation._id} />
                <SendMessages conversationId={selectedConversation._id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessengerScreen;