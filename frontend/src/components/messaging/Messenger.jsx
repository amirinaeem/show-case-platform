import React, { useState } from 'react';
import { 
  Image, 
  Stack, 
  Form, 
  InputGroup, 
  Button, 
  OverlayTrigger, 
  Tooltip 
} from 'react-bootstrap';
import { 
  FaPhoneAlt,
  FaVideo,
  FaEllipsisH,
  FaCheckDouble, 
  FaPlusCircle, 
  FaFileImage, 
  FaGift, 
  FaPaperPlane 
} from 'react-icons/fa';
import { RiChat3Line } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import '../../assets/styles/messaging/messenger.css';

const Messenger = (props) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  //selected friend
  const { selectFriend, userInfo } = props;

  console.log('selected friend data', selectFriend)

  // Sample messages data
  const messages = [
    {
      id: 1,
      text: "Hello there! How are you doing?",
      time: "2 mins ago",
      sender: "me",
      status: "read",
      type: "text"
    },
    {
      id: 2,
      text: "I'm doing great, thanks for asking!",
      time: "1 min ago",
      sender: "friend",
      type: "text"
    },
    {
      id: 3,
      image: "./image/default-image.jpg",
      time: "Just now",
      sender: "friend",
      type: "image"
    }
  ];

  const renderTooltip = (msg) => (
    <Tooltip>{msg}</Tooltip>
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Message sent:", message);
      setMessage('');
    }
  };

  return (
    <div className="messenger-container">
      {/* Message Header */}
      <div className="message-header">
        <div className="d-flex align-items-center">
          <Image 
            src ={selectFriend.avatar} 
            roundedCircle 
            className="message-header-avatar"
          />
          <div className="ms-3">
            <h5 className="mb-0">{selectFriend.name}</h5>
            <small className="text-muted">Online</small>
          </div>
        </div>
        <div className="header-icons">
          <OverlayTrigger placement="top" overlay={renderTooltip("Call")}>
            <button className="icon-button"><FaPhoneAlt /></button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderTooltip("Video Call")}>
            <button className="icon-button"><FaVideo /></button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={renderTooltip("More Options")}>
            <button className="icon-button"><FaEllipsisH /></button>
          </OverlayTrigger>
        </div>
      </div>

      {/* Messages Display Area */}
      <div className="messages-display">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender === 'me' ? 'outgoing' : 'incoming'}`}
          >
            <Stack direction="horizontal" gap={2} className={msg.sender === 'me' ? "justify-content-end" : ""}>
              {msg.sender !== 'me' && (
                <Image 
                  src="SHCAPL-logo.jpg" 
                  alt="friend profile" 
                  roundedCircle 
                  className="message-avatar"
                />
              )}
              
              <div className="message-bubble">
                {msg.type === 'image' ? (
                  <Image 
                    src={msg.image} 
                    alt="shared content" 
                    thumbnail 
                    className="shared-image"
                  />
                ) : (
                  <p className="message-text mb-0">{msg.text}</p>
                )}
                <div className="message-meta">
                  <span className="message-time">{msg.time}</span>
                  {msg.sender === 'me' && msg.status && (
                    <span className="message-status">
                      <FaCheckDouble className={`read-icon ${msg.status}`} />
                    </span>
                  )}
                </div>
              </div>

              {msg.sender === 'me' && (
                <Image 
                  src="SHCAPL-logo.jpg" 
                  alt="user profile" 
                  roundedCircle 
                  className="message-avatar"
                />
              )}
            </Stack>
          </div>
        ))}

        {/* Typing Indicator */}
        <div className="typing-indicator">
          <Stack direction="horizontal" gap={2}>
            <Image 
              src="SHCAPL-logo.jpg" 
              alt="friend profile" 
              roundedCircle 
              className="message-avatar"
            />
            <div className="typing-bubble">
              <div className="typing-content">
                <RiChat3Line className="typing-icon" />
                <span>Typing...</span>
              </div>
            </div>
          </Stack>
        </div>
      </div>

      {/* Message Input Area */}
      <Form onSubmit={handleSendMessage} className="message-input-area">
        <div className="message-actions">
          <OverlayTrigger placement="top" overlay={renderTooltip("Add Attachment")}>
            <Button variant="link" className="action-btn">
              <FaPlusCircle size={20} />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={renderTooltip("Add Image")}>
            <label htmlFor="pic" className="file-input-label">
              <FaFileImage size={20} />
              <input type="file" id="pic" className="file-input" />
            </label>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={renderTooltip("Add Gift")}>
            <Button variant="link" className="action-btn">
              <FaGift size={20} />
            </Button>
          </OverlayTrigger>
          <Button  
            variant="link" 
            className="emoji-toggle-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            ❤️
          </Button>
          <Button 
          type="submit" 
          variant="link" 
          className="send-btn"
          disabled={!message.trim()}
        >
          <FaPaperPlane size={20} />
        </Button>
        </div>

        <InputGroup className="message-input-group">
          <Form.Control
            as='textarea'
            rows={1}
            placeholder="Type a message..."
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
        </InputGroup>

        

        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker 
              onEmojiClick={(emojiData) => {
                setMessage(prev => prev + emojiData.emoji);
                setShowEmojiPicker(false);
              }} 
              width={300} 
              height={350} 
            />
          </div>
        )}
      </Form>
    </div>
  );
};

export default Messenger;