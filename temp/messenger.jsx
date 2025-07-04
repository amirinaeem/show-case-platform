import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import {
  FaPhoneAlt, FaVideo, FaEllipsisH, FaGift, FaPaperPlane,
  FaCheckDouble, FaFileAlt, FaTimesCircle, FaCircle
} from 'react-icons/fa';
import {
  Stack, Form, InputGroup, Button,
  Image, OverlayTrigger, Tooltip, Spinner, Alert,
} from 'react-bootstrap';

import { useGetMessageQuery, useSendMessageMutation } from '../../slices/messengerSlice';
import EmojiPicker from 'emoji-picker-react';
import UploadFiles from './UploadFiles';
import UploadImages from './UploadImages';

import { v4 as uuidv4 } from 'uuid';
import '../../assets/styles/messaging/messenger.css';

const Messenger = ({ selectFriend, userInfo, connectedUsers, socket }) => {
  const scrollRef = useRef();
  const typingTimeoutRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [friendTyping, setFriendTyping] = useState(false);

  const isFriendOnline = connectedUsers.some(user => user.id === selectFriend?._id);

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
  } = useGetMessageQuery(selectFriend?._id, {
    skip: !selectFriend?._id,
    refetchOnMountOrArgChange: false,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, localMessages]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !selectFriend?._id) return;
    const currentTypingTimeout = typingTimeoutRef.current;
    const currentTypingStopTimeout = typingStopTimeoutRef.current;

    console.log('Setting up socket listeners...');

    const handleMessage = (msg) => {
      console.log('Message received:', msg);
      if (
        (msg.senderId === selectFriend._id && msg.receiverId === userInfo._id) ||
        (msg.senderId === userInfo._id && msg.receiverId === selectFriend._id)
      ) {
        const id = msg._id || uuidv4();
        setLocalMessages(prev => {
          const exists = prev.find(m => m._id === id);
          return exists ? prev : [...prev, { ...msg, _id: id }];
        });
      }
    };

    const handleTypingStart = ({ from }) => {
      console.log('Typing start received from:', from);
      if (from === selectFriend._id) {
        setFriendTyping(true);
        clearTimeout(typingTimeoutRef.current);
      }
    };

    const handleTypingStop = ({ from }) => {
      console.log('Typing stop received from:', from);
      if (from === selectFriend._id) {
        setFriendTyping(false);
        clearTimeout(typingTimeoutRef.current);
      }
    };

    socket.on('messageReceived', handleMessage);
    socket.on('typingStart', handleTypingStart);
    socket.on('typingStop', handleTypingStop);

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('messageReceived', handleMessage);
      socket.off('typingStart', handleTypingStart);
      socket.off('typingStop', handleTypingStop);
      clearTimeout(currentTypingTimeout);
      clearTimeout(currentTypingStopTimeout);
    };
  }, [socket, selectFriend?._id, userInfo._id]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!isTyping && message.trim().length > 0) {
      console.log('Starting typing indicator');
      setIsTyping(true);
      socket.emit('typingStart', {
        from: userInfo._id,
        to: selectFriend._id
      });
    }

    // Reset the typing timeout
    clearTimeout(typingStopTimeoutRef.current);
    typingStopTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        console.log('Auto-stopping typing (no activity)');
        setIsTyping(false);
        socket.emit('typingStop', {
          from: userInfo._id,
          to: selectFriend._id
        });
      }
    }, 1500);
  }, [isTyping, message, socket, selectFriend?._id, userInfo._id]);

  // Handle input changes
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectFriend?._id || isSending) return;

    console.log('Submitting message...');
    
    // Clear typing indicators
    if (isTyping) {
      console.log('Clearing typing indicators on submit');
      setIsTyping(false);
      socket.emit('typingStop', {
        from: userInfo._id,
        to: selectFriend._id
      });
      clearTimeout(typingStopTimeoutRef.current);
    }

    try {
      const newMessage = await sendMessage({
        receiverId: selectFriend._id,
        text: message,
      }).unwrap();

      console.log('Message sent, emitting socket event');
      socket.emit('newMessage', {
        message: newMessage,
        to: selectFriend._id,
        from: userInfo._id
      });

      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Format message time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render message content
  const renderMessageContent = useCallback((msg) => {
    const { files = [], text } = msg.message || msg;
    if (files.length > 0) {
      return (
        <div className="file-message">
          {files.map((file, i) => (
            <div key={i} className="file-attachment-display">
              {file.type === 'image' ? (
                <div className="image-message-container">
                  <Image src={file.url} className="shared-image" thumbnail alt={`Attachment ${i}`} />
                </div>
              ) : (
                <>
                  <FaFileAlt size={24} />
                  <div className="file-info">
                    <span className="file-name">{file.fileName}</span>
                    <span className="file-size">{file.fileType}</span>
                  </div>
                </>
              )}
            </div>
          ))}
          {text && <p className="message-text mb-0">{text}</p>}
        </div>
      );
    }

    return <p className="message-text mb-0">{text || msg.text}</p>;
  }, []);

  // Combine and deduplicate messages
  const uniqueMessages = useMemo(() => {
    const combined = [...messages, ...localMessages];
    const map = new Map();
    combined.forEach(msg => {
      map.set(msg._id, msg);
    });
    return Array.from(map.values());
  }, [messages, localMessages]);

  if (isLoading) {
    return (
      <div className="messenger-container d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" />
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
    <div className="messenger-container pb-5">
      {/* Header */}
      <div className="message-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Image
            src={selectFriend?.avatar || '/images/default-avatar.png'}
            roundedCircle
            className={`message-header-avatar ${isFriendOnline ? 'online-avatar' : 'offline-avatar'}`}
            alt="Friend avatar"
          />
          {isFriendOnline && <div className="online-indicator"><span className="online-circle" /></div>}
          <div className="ms-3">
            <h5 className="mb-0">{selectFriend?.name || 'Unknown User'}</h5>
          </div>
        </div>
        <div className="header-icons d-flex align-items-center gap-2">
          <OverlayTrigger placement="top" overlay={<Tooltip>Call</Tooltip>}>
            <button className="icon-button"><FaPhoneAlt /></button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Video Call</Tooltip>}>
            <button className="icon-button"><FaVideo /></button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>More Options</Tooltip>}>
            <button className="icon-button"><FaEllipsisH /></button>
          </OverlayTrigger>
          <small className="text-muted">
            {isFriendOnline ? <FaCircle className="text-success me-1" size={8} /> : 'Offline'}
          </small>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-display p-3" ref={scrollRef} style={{ overflowY: 'auto' }}>
        {uniqueMessages.map((msg) => {
          const isMe = msg.senderId === userInfo._id;

          return (
            <div key={msg._id} className={`message ${isMe ? 'outgoing' : 'incoming'}`}>
              <Stack direction="horizontal" gap={2} className={isMe ? 'justify-content-end' : ''}>
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

        {friendTyping && (
  <div className="typing-indicator">
    <Image 
      src={selectFriend?.avatar || '/images/default-avatar.png'} 
      alt="Friend profile" 
      roundedCircle 
      className="message-avatar"
      style={{ width: '32px', height: '32px', marginRight: '8px' }}
    />
    <div className="typing-bubble">
      <div className="typing-content">
        <div className="typing-dots">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
        <span className="typing-text">Typing...</span>
      </div>
    </div>
  </div>
)}
      </div>

      {/* Input Area */}
      <Form onSubmit={handleSubmit} className="message-input-area">
        <div className="message-actions d-flex gap-2 align-items-center">
          <OverlayTrigger placement="top" overlay={<Tooltip>Send Files</Tooltip>}>
            <div><UploadFiles selectFriend={selectFriend} /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Send Images</Tooltip>}>
            <div><UploadImages selectFriend={selectFriend} /></div>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Add Gift</Tooltip>}>
            <Button variant="link" className="gift-btn"><FaGift size={20} /></Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Emojis</Tooltip>}>
            <Button variant="link" className="emoji-toggle-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              ❤️
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip>Send</Tooltip>}>
            <Button type="submit" variant="link" className="send-btn" disabled={!message.trim() || isSending}>
              {isSending ? <Spinner animation="border" size="sm" /> : <FaPaperPlane size={20} />}
            </Button>
          </OverlayTrigger>
        </div>

        <InputGroup className="message-input-group">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Type a message..."
            className="message-input"
            value={message}
            onChange={handleInputChange}
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
              onEmojiClick={(emojiData) => setMessage(prev => prev + emojiData.emoji)}
              width={300}
              height={350}
            />
            <Button variant="link" className="close-emoji-picker" onClick={() => setShowEmojiPicker(false)}>
              <FaTimesCircle size={20} />
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Messenger;