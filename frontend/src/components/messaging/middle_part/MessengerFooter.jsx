import { useEffect, useRef } from 'react';
import {
  Form,
  InputGroup,
  Button,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from 'react-bootstrap';
import { FaPaperPlane, FaGift, FaTimesCircle } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import UploadFiles from './UploadFiles';
import UploadImages from './UploadImages';

const MessengerFooter = ({
  message,
  setMessage,
  handleSubmit,
  handleTyping,
  isSending,
  showEmojiPicker,
  setShowEmojiPicker,
  selectFriend,
  onMessageSent, // Now properly destructured from props
}) => {
  const inputRef = useRef(null);

  const onChange = (e) => {
    setMessage(e.target.value);
    handleTyping?.();
  };

  const handleSubmitWithScroll = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    await handleSubmit(e);
    // Call the scroll callback after message is sent
    onMessageSent?.();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectFriend]);

  return (
    <Form onSubmit={handleSubmitWithScroll} className="message-input-area">
      <div className="message-actions d-flex gap-2 align-items-center">
        <OverlayTrigger placement="top" overlay={<Tooltip>Send Files</Tooltip>}>
          <div>
            <UploadFiles selectFriend={selectFriend} />
          </div>
        </OverlayTrigger>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Send Images</Tooltip>}
        >
          <div>
            <UploadImages selectFriend={selectFriend} />
          </div>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Add Gift</Tooltip>}>
          <Button variant="link" className="gift-btn">
            <FaGift size={20} />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Emojis</Tooltip>}>
          <Button
            variant="link"
            className="emoji-toggle-btn"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            ❤️
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Send</Tooltip>}>
          <Button
            type="submit"
            variant="link"
            className="send-btn"
            disabled={!message?.trim?.() || isSending}
          >
            {isSending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FaPaperPlane size={20} />
            )}
          </Button>
        </OverlayTrigger>
      </div>

      <InputGroup className="message-input-group">
        <Form.Control
          ref={inputRef}
          as="textarea"
          rows={1}
          placeholder="Type a message..."
          className="message-input"
          value={message}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmitWithScroll(e);
            }
          }}
        />
      </InputGroup>

      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={(emojiData) =>
              setMessage((prev) => prev + emojiData.emoji)
            }
            width={300}
            height={350}
          />
          <Button
            variant="link"
            className="close-emoji-picker"
            onClick={() => setShowEmojiPicker(false)}
          >
            <FaTimesCircle size={20} />
          </Button>
        </div>
      )}
    </Form>
  );
};

export default MessengerFooter;