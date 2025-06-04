import '../../assets/styles/messaging/messengerScreen.css';
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import LeftSide from '../../components/messaging/LeftSide';
import RightSide from '../../components/messaging/RightSide';
import Messenger from '../../components/messaging/Messenger';
import { useGetFriendsQuery } from '../../slices/messengerSlice';

const MessengerScreen = () => {
  // User data/leftside
  const { data: friends = [], isLoading, error } = useGetFriendsQuery();
  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    if (error) console.log('Error fetching friends', error);
  }, [error]);

  // Messenger state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [messages, setMessages] = useState([
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
  ]);
  
  const [selectFriend, setSelectFriend] = useState(null);

  // Message handler
  const inputHandler = useCallback((e) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "me",
      status: "sent",
      type: attachments.length > 0 ? (message.trim() ? 'mixed' : 'file') : 'text',
      attachments: attachments.map(att => ({
        type: att.type,
        name: att.name,
        size: att.size,
        url: att.preview
      }))
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setAttachments([]);
  }, [message, attachments]);

  

  // File handling
  const handleFileUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    const newAttachments = files.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : 'file',
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      size: formatFileSize(file.size)
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
  }, []);

  const removeAttachment = useCallback((index) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      if (newAttachments[index]?.preview) {
        URL.revokeObjectURL(newAttachments[index].preview);
      }
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment?.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
    };
  }, [attachments]);

  return (
    <Container fluid className="messenger-screen">
      <Row className="h-100">
        <Col md={3}>
          <LeftSide
            userInfo={userInfo}
            friends={friends}
            setSelectFriend={setSelectFriend}
            isLoading={isLoading}
          />
        </Col>
        <Col md={6}>
          {selectFriend ? (
            <Messenger
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              message={message}
              setMessage={setMessage}
              attachments={attachments}
              messages={messages}
              selectFriend={selectFriend}
              userInfo={userInfo}
              inputHandler={inputHandler}
              handleFileUpload={handleFileUpload}
              removeAttachment={removeAttachment}
            />
          ) : (
            <div className="select-friend-prompt">
              Please select someone to chat with
            </div>
          )}
        </Col>
        <Col md={3}>
          <RightSide
            selectFriend={selectFriend}
            userInfo={userInfo}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default MessengerScreen;