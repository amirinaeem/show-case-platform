import { useEffect, useRef, useState, useCallback } from 'react';

export default function useMessageSocket(socket, userInfo, selectFriend) {
  const typingStopTimeoutRef = useRef(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [friendTyping, setFriendTyping] = useState(false);

  useEffect(() => {
    if (!socket || !selectFriend?._id) return;

    const handleMessage = (msg) => {
      if (
        (msg.senderId === selectFriend._id && msg.receiverId === userInfo._id) ||
        (msg.senderId === userInfo._id && msg.receiverId === selectFriend._id)
      ) {
        setLocalMessages(prev => [...prev, msg]);
      }
    };

    const handleTypingStart = ({ from }) => {
      if (from === selectFriend._id) {
        setFriendTyping(true);
        clearTimeout(typingStopTimeoutRef.current);
      }
    };

    const handleTypingStop = ({ from }) => {
      if (from === selectFriend._id) {
        setFriendTyping(false);
        clearTimeout(typingStopTimeoutRef.current);
      }
    };

    socket.on('messageReceived', handleMessage);
    socket.on('typingStart', handleTypingStart);
    socket.on('typingStop', handleTypingStop);

    return () => {
      socket.off('messageReceived', handleMessage);
      socket.off('typingStart', handleTypingStart);
      socket.off('typingStop', handleTypingStop);
      clearTimeout(typingStopTimeoutRef.current);
    };
  }, [socket, selectFriend?._id, userInfo._id]); // Added userInfo._id to dependencies

  const handleTyping = useCallback(() => {
    if (!socket || !selectFriend?._id) return;

    socket.emit('typingStart', {
      from: userInfo._id,
      to: selectFriend._id,
    });

    clearTimeout(typingStopTimeoutRef.current);
    typingStopTimeoutRef.current = setTimeout(() => {
      socket.emit('typingStop', {
        from: userInfo._id,
        to: selectFriend._id,
      });
    }, 1500);
  }, [socket, userInfo._id, selectFriend?._id]);

  const emitMessage = useCallback((message) => {
    if (!socket || !selectFriend?._id || !message) return;
    
    const fullMessage = {
      ...message,
      senderId: userInfo._id,
      receiverId: selectFriend._id,
      createdAt: new Date().toISOString()
    };

    socket.emit('newMessage', {
      message: fullMessage,
      to: selectFriend._id,
      from: userInfo._id
    });
  }, [socket, selectFriend?._id, userInfo._id]);

  return {
    localMessages,
    setLocalMessages,
    friendTyping,
    handleTyping,
    emitMessage,
  };
}