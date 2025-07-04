import { useMemo, useState, useRef, useEffect } from 'react';
import '../../../assets/styles/messaging/messenger.css';
import {
  useGetMessageQuery,
  useSendMessageMutation,
} from '../../../slices/messengerSlice';
import useMessageSocket from '../../../socket/hooks/useMessageSocket';
import MessengerHeader from './MessengerHeader';
import ChatDisplayContainer from './ChatDisplayContainer';
import MessengerFooter from './MessengerFooter';

const Messenger = ({ selectFriend, userInfo, connectedUsers, socket }) => {
  const scrollRef = useRef(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data: messages = [], isLoading } = useGetMessageQuery(selectFriend?._id, {
    skip: !selectFriend?._id,
  });

  const [sendMessage] = useSendMessageMutation();

  const isFriendOnline = connectedUsers.some(
    (user) => user.id === selectFriend?._id
  );

  const {
    localMessages,
    setLocalMessages,
    friendTyping,
    handleTyping,
    emitMessage,
  } = useMessageSocket(socket, userInfo, selectFriend);

  const uniqueMessages = useMemo(() => {
    const combined = [...messages, ...localMessages];
    const map = new Map();
    combined.forEach((msg) => map.set(msg._id, msg));
    return Array.from(map.values());
  }, [messages, localMessages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll handler
  useEffect(() => {
    if (isLoading) return;
    
    const container = scrollRef.current;
    if (!container) return;

    // Check if we're near the bottom (within 100px)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    // Scroll if:
    // 1. It's the initial load
    // 2. New messages arrive and we're near the bottom
    // 3. Friend starts typing and we're near the bottom
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [uniqueMessages, friendTyping, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectFriend?._id) return;

    setIsSending(true);
    try {
      const sentMessage = await sendMessage({
        receiverId: selectFriend._id,
        text: message,
      }).unwrap();
      
      emitMessage(sentMessage);
      setLocalMessages((prev) => [...prev, { 
        ...sentMessage, 
        _id: sentMessage._id || crypto.randomUUID() 
      }]);
      setMessage('');
      setShowEmojiPicker(false);
    } catch (err) {
      console.error('Message sending failed:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="messenger-container pb-5">
      <MessengerHeader
        selectFriend={selectFriend}
        isFriendOnline={isFriendOnline}
      />
      <ChatDisplayContainer
        messages={uniqueMessages}
        userInfo={userInfo}
        selectFriend={selectFriend}
        friendTyping={friendTyping}
        scrollRef={scrollRef}
      />
      <MessengerFooter
        message={message}
        setMessage={setMessage}
        handleSubmit={handleSubmit}
        handleTyping={handleTyping}
        isSending={isSending}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        selectFriend={selectFriend}
        onMessageSent={scrollToBottom} // Pass scroll callback
      />
    </div>
  );
};

export default Messenger;