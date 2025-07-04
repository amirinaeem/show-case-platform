import { Stack, Image } from 'react-bootstrap';
import { FaCheckDouble, FaEllipsisH } from 'react-icons/fa';
import { formatTime, renderMessageContent } from './MessengerHelper';

const ChatDisplayContainer = ({ 
  messages, 
  userInfo, 
  selectFriend, 
  friendTyping,
  scrollRef 
}) => {
  return (
    <div 
      className="messages-display p-3" 
      ref={scrollRef}
      style={{ overflowY: 'auto' }}
    >
      {messages.map((msg) => {
        const isMe = msg.senderId === userInfo._id;
        return (
          <div key={msg._id} className={`message ${isMe ? 'outgoing' : 'incoming'}`}>
            <Stack direction="horizontal" gap={2} className={isMe ? 'justify-content-end' : ''}>
              {!isMe && (
                <Image 
                  src={selectFriend?.avatar || '/images/default-avatar.png'} 
                  roundedCircle 
                  className="message-avatar"
                  alt="Friend avatar"
                />
              )}
              <div className="message-bubble">
                {renderMessageContent(msg)}
                <div className="message-meta">
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                  {isMe && msg.status && (
                    <span className="message-status">
                      <FaCheckDouble className={`read-icon ${msg.status}`} />
                    </span>
                  )}
                </div>
              </div>
              {isMe && (
                <Image 
                  src={userInfo?.avatar || '/images/default-avatar.png'} 
                  roundedCircle 
                  className="message-avatar"
                  alt="Your avatar"
                />
              )}
            </Stack>
          </div>
        );
      })}

      {friendTyping && (
        <div className="typing-indicator">
          <Image 
            src={selectFriend?.avatar || '/images/default-avatar.png'} 
            roundedCircle 
            className="message-avatar"
            alt="Typing indicator"
          />
          <div className="typing-bubble">
            <div className="typing-content">
              <FaEllipsisH className="typing-icon" />
              <span className="typing-text">Typing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDisplayContainer;