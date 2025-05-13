import { useState, useRef } from 'react';
import { useSendMessageMutation } from '../../slices/messagingApiSlice';
import EmojiPicker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faLocationArrow } from '@fortawesome/free-solid-svg-icons';

function SendMessage({ conversationId }) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await sendMessage({ conversationId, text: message }).unwrap();
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleEmojiClick = (emojiData) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBefore = message.substring(0, cursorPosition);
    const textAfter = message.substring(cursorPosition);
    
    setMessage(textBefore + emojiData.emoji + textAfter);
    
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = cursorPosition + emojiData.emoji.length;
      textareaRef.current.selectionEnd = cursorPosition + emojiData.emoji.length;
    }, 0);
  };

  return (
    <div className="card-footer">
      <form onSubmit={handleSubmit} className="input-group">
        <div className="emoji-picker-container">
          <button 
            type="button"
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <span role="img" aria-label="emoji">😊</span>
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <EmojiPicker 
                onEmojiClick={handleEmojiClick}
                width={300}
                height={350}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </div>
        <textarea
          ref={textareaRef}
          name="message"
          className="form-control type_msg"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
        />
        <div className="input-group-append">
          <span className="input-group-text attach_btn">
            <FontAwesomeIcon icon={faPaperclip} />
          </span>
          <button type="submit" className="input-group-text send_btn">
            <FontAwesomeIcon icon={faLocationArrow} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default SendMessage;