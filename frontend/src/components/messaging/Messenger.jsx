import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useGetMessageQuery, useSendMessageMutation } from '../../slices/messengerSlice';
import EmojiPicker from 'emoji-picker-react';
import UploadFiles from './UploadFiles';
import UploadImages from './UploadImages';
import {
  Stack, Form, InputGroup, Button,
  Image, OverlayTrigger, Tooltip, Spinner, Alert
} from 'react-bootstrap';
import {
  FaPhoneAlt, FaVideo, FaEllipsisH, FaGift, FaPaperPlane,
  FaCheckDouble, FaFileAlt, FaTimesCircle, FaCircle
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import '../../assets/styles/messaging/messenger.css';

const Messenger = ({ selectFriend, userInfo, connectedUsers, socket }) => {
  const scrollRef = useRef();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);

  const isFriendOnline = connectedUsers.some(user => user.id === selectFriend?._id);

  // Fetch messages with minimal re-fetching
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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, localMessages]);

  // Handle incoming socket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      if (
        (msg.senderId === selectFriend?._id && msg.receiverId === userInfo._id) ||
        (msg.senderId === userInfo._id && msg.receiverId === selectFriend?._id)
      ) {
        // Ensure each message has a unique _id (fallback with UUID)
        const id = msg._id || uuidv4();
        setLocalMessages(prev => {
          const exists = prev.find(m => m._id === id);
          if (exists) return prev;
          return [...prev, { ...msg, _id: id }];
        });
      }
    };

    socket.on('messageReceived', handleMessage);
    return () => socket.off('messageReceived', handleMessage);
  }, [socket, selectFriend?._id, userInfo._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectFriend?._id || isSending) return;

    try {
      const newMessage = await sendMessage({
        receiverId: selectFriend._id,
        text: message,
      }).unwrap();

      socket.emit('newMessage', {
        message: newMessage,
        to: selectFriend._id
      });

      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  // Deduplicate messages from API + socket
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
      </div>

      {/* Input */}
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
              onEmojiClick={(emojiData) => setMessage(prev => prev + emojiData.emoji)}
              width={300}
              height={350}
            />
            <Button variant="link" className="close-emoji-picker" onClick={() => setShowEmojiPicker(false)}>
              <FaTimesCircle size={40} />
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Messenger;
