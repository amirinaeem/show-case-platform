import { 
  Image, 
  Stack, 
  Form, 
  InputGroup, 
  Button, 
  OverlayTrigger, 
  Tooltip,
  Badge,
  CloseButton
} from 'react-bootstrap';
import { 
  FaPhoneAlt,
  FaVideo,
  FaEllipsisH,
  FaCheckDouble, 
  FaPlusCircle, 
  FaFileImage, 
  FaGift, 
  FaPaperPlane,
  FaFileAlt
} from 'react-icons/fa';
import { RiChat3Line } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import '../../assets/styles/messaging/messenger.css';

const Messenger = ({
  showEmojiPicker,
  setShowEmojiPicker,
  message,
  setMessage,
  attachments,
  messages,
  selectFriend,
  userInfo,
  inputHandler,
  handleFileUpload,
  removeAttachment
}) => {
  const renderTooltip = (msg) => <Tooltip>{msg}</Tooltip>;

  const renderAttachmentPreview = (attachment) => {
    if (attachment.type === 'image') {
      return (
        <div className="image-attachment">
          <Image 
            src={attachment.preview} 
            thumbnail 
            className="attachment-thumbnail"
            alt="Preview"
          />
          <Badge bg="secondary" className="file-size-badge">
            {attachment.size}
          </Badge>
        </div>
      );
    }
    return (
      <div className="file-attachment">
        <FaFileAlt size={24} />
        <div className="file-info">
          <span className="file-name">{attachment.name}</span>
          <span className="file-size">{attachment.size}</span>
        </div>
      </div>
    );
  };

  const renderMessageContent = (msg) => {
  if (msg.type === 'image') {
    return (
      <div className="image-message-container">
        <Image 
          src={msg.image} 
          alt="Shared content" 
          className="shared-image"
          thumbnail
        />
      </div>
    );
  }
  
  if (msg.type === 'file' || msg.type === 'mixed') {
    return (
      <div className="file-message">
        {msg.attachments?.map((att, i) => (
          <div key={i} className="attachment-display">
            {att.type === 'image' ? (
              <div className="image-message-container">
                <Image 
                  src={att.url} 
                  className="shared-image"
                  thumbnail
                  alt="Attachment"
                />
              </div>
            ) : (
              <div className="file-attachment-display">
                <FaFileAlt size={24} />
                <div className="file-info">
                  <span className="file-name">{att.name}</span>
                  <span className="file-size">{att.size}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {msg.text && <p className="message-text mb-0">{msg.text}</p>}
      </div>
    );
  }
  
  return <p className="message-text mb-0">{msg.text}</p>;
};

  return (
    <div className="messenger-container">
      {/* Message Header */}
      <div className="message-header">
        <div className="d-flex align-items-center">
          <Image 
            src={selectFriend?.avatar} 
            roundedCircle 
            className="message-header-avatar"
            alt="Friend avatar"
          />
          <div className="ms-3">
            <h5 className="mb-0">{selectFriend?.name || 'Unknown User'}</h5>
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
                  src={selectFriend?.avatar} 
                  alt="Friend profile" 
                  roundedCircle 
                  className="message-avatar"
                />
              )}
              
              <div className="message-bubble">
                {renderMessageContent(msg)}
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
                  src={userInfo?.avatar} 
                  alt="Your profile" 
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
              src={selectFriend?.avatar} 
              alt="Friend profile" 
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
      <Form onSubmit={inputHandler} className="message-input-area">
        {attachments.length > 0 && (
          <div className="attachments-preview">
            {attachments.map((attachment, index) => (
              <div key={index} className="attachment-item">
                {renderAttachmentPreview(attachment)}
                <CloseButton 
                  className="remove-attachment-btn"
                  onClick={() => removeAttachment(index)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="message-actions">
          <OverlayTrigger placement="top" overlay={renderTooltip("Add Attachment")}>
            <Button variant="link" className="action-btn">
              <label htmlFor="file-upload" className="file-input-label">
                <FaPlusCircle size={20} />
              </label>
              <input 
                type="file" 
                id="file-upload" 
                className="file-input" 
                onChange={handleFileUpload}
                multiple
              />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={renderTooltip("Add Image")}>
            <Button variant="link" className="action-btn">
              <label htmlFor="image-upload" className="file-input-label">
                <FaFileImage size={20} />
              </label>
              <input 
                type="file" 
                id="image-upload" 
                className="file-input" 
                onChange={handleFileUpload}
                accept="image/*"
                multiple
              />
            </Button>
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
            disabled={!message.trim() && attachments.length === 0}
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                inputHandler(e);
              }
            }}
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