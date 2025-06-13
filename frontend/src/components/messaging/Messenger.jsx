import EmojiPicker from 'emoji-picker-react';
import { useGetMessageQuery, useSendMessageMutation } from '../../slices/messengerSlice';
import { 
  Stack, 
  Form, 
  InputGroup, 
  Button,
  Image,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Alert
} from 'react-bootstrap';
import { 
  FaPhoneAlt,
  FaVideo,
  FaEllipsisH,
  FaGift, 
  FaPaperPlane,
  FaCheckDouble,
  FaFileAlt,
} from 'react-icons/fa';
import { RiChat3Line } from 'react-icons/ri';
import { useCallback, useEffect, useRef, useState } from 'react';
import UploadFiles from './UploadFiles';
import UploadImages from './UploadImages';
import '../../assets/styles/messaging/messenger.css';

const Messenger = ({
  selectFriend,
  userInfo,
}) => {
  const scrollRef = useRef();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Get messages for the selected friend
  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch
  } = useGetMessageQuery(selectFriend?._id, {
    skip: !selectFriend?._id,
    pollingInterval: 5000, // Optional: refetch messages every 5 seconds
  });

  // Send message mutation
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const renderMessageContent = useCallback((msg) => {
    if (msg.message?.files?.length > 0) {
      return (
        <div className="file-message">
          {msg.message.files.map((file, i) => (
            <div key={i} className="file-attachment-display">
              {file.type === 'image' ? (
                <div className="image-message-container">
                  <Image 
                    src={file.url} 
                    className="shared-image"
                    thumbnail
                    alt={`Attachment ${i}`}
                  />
                </div>
              ) : (
                <div className="file-attachment-display">
                  <FaFileAlt size={24} />
                  <div className="file-info">
                    <span className="file-name">{file.fileName}</span>
                    <span className="file-size">{file.fileType}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {msg.message?.text && <p className="message-text mb-0">{msg.message.text}</p>}
        </div>
      );
    }
    return <p className="message-text mb-0">{msg.message?.text || msg.text}</p>;
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectFriend?._id || isSending) return;

    try {
      await sendMessage({
        receiverId: selectFriend._id,
        text: message,
      }).unwrap();
      setMessage('');
      refetch(); 
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!selectFriend) {
    return (
      <div className="messenger-container d-flex justify-content-center align-items-center">
        <div className="text-center">
          <RiChat3Line size={48} className="text-muted mb-3" />
          <h5>Select a conversation to start chatting</h5>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="messenger-container d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading messages...</span>
        </Spinner>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="messenger-container d-flex justify-content-center align-items-center">
        <Alert variant="danger">
          Error loading messages: {error?.data?.message || error.message}
        </Alert>
      </div>
    );
  }

  return (
    <div className="messenger-container">
      {/* Message Header */}
      <div className="message-header">
        <div className="d-flex align-items-center">
          <Image 
            src={selectFriend?.avatar || '/images/default-avatar.png'} 
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
          <OverlayTrigger placement="top" overlay={<Tooltip>Call</Tooltip>}>
            <button className="icon-button"><FaPhoneAlt /></button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Video Call</Tooltip>}>
            <button className="icon-button"><FaVideo /></button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>More Options</Tooltip>}>
            <button className="icon-button"><FaEllipsisH /></button>
          </OverlayTrigger>
        </div>
      </div>

      {/* Messages Display Area */}
      <div
        className="messages-display"
        ref={scrollRef}
        style={{overflowY: 'auto'}}
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === userInfo._id;
          
          return (
            <div 
              key={msg._id} 
              className={`message ${isMe ? 'outgoing' : 'incoming'}`}
            >
              <Stack direction="horizontal" gap={2} className={isMe ? "justify-content-end" : ""}>
                {!isMe && (
                  <Image 
                    src={selectFriend?.avatar || '/images/default-avatar.png'} 
                    alt="Friend profile" 
                    roundedCircle 
                    className="message-avatar"
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
                    alt="Your profile" 
                    roundedCircle 
                    className="message-avatar"
                  />
                )}
              </Stack>
            </div>
          );
        })}

        
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
      <Form onSubmit={handleSubmit} className="message-input-area">
        
        <div className="message-actions">
          <UploadFiles />
          <UploadImages />

          <OverlayTrigger placement="top" overlay={<Tooltip>Add Gift</Tooltip>}>
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
            disabled={!message.trim() || isSending}
          >
            {isSending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FaPaperPlane size={20} />
            )}
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
                handleSubmit(e);
              }
            }}
          />
        </InputGroup>

        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker 
              onEmojiClick={(emojiData) => {
                setMessage(prev => prev + emojiData.emoji);
              }} 
              width={300} 
              height={350} 
            />
            <Button 
              variant="link" 
              className="close-emoji-picker"
              onClick={() => setShowEmojiPicker(false)}
            >
              Close
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Messenger;