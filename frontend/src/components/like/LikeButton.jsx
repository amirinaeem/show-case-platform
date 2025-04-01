import { useState, useEffect } from 'react';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLikeApplicationMutation } from '../../slices/applicationsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThumbsUp, 
  faHeart, 
  faLaughBeam, 
  faSurprise, 
  faSadTear,
  faFire
} from '@fortawesome/free-solid-svg-icons';

const emojiOptions = [
  { icon: faThumbsUp, label: 'Like', value: '👍' },
  { icon: faHeart, label: 'Love', value: '❤️' },
  { icon: faLaughBeam, label: 'Haha', value: '😂' },
  { icon: faSurprise, label: 'Wow', value: '😮' },
  { icon: faSadTear, label: 'Sad', value: '😢' },
  { icon: faFire, label: 'Fire', value: '🔥' }
];

const LikeButton = ({ application, userInfo, onLikeSuccess }) => {
  const [likeApplication] = useLikeApplicationMutation();
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [likeCount, setLikeCount] = useState(
    application.metrics?.likes || application.likes?.length || 0
  );
  const [selectedEmoji, setSelectedEmoji] = useState('👍');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    setIsLiked(userInfo && application.likes?.includes(userInfo._id));
  }, [userInfo, application.likes]);

  const handleLike = async (emoji = selectedEmoji) => {
    if (!userInfo) {
      toast.error('Please login to like applications');
      return;
    }

    setIsAnimating(true);
    const wasLiked = isLiked;
    const newLikeCount = wasLiked ? likeCount - 1 : likeCount + 1;
    
    setIsLiked(!wasLiked);
    setLikeCount(newLikeCount);
    if (emoji) setSelectedEmoji(emoji);

    try {
      const result = await likeApplication({
        appId: application._id,
        emoji: emoji // Make sure your backend expects this field
      }).unwrap();
      onLikeSuccess(result);
      toast.success(
        <div>
          <span className="emoji">{emoji}</span> {result.message || 'Reaction added!'}
        </div>,
        { icon: false }
      );
    } catch (error) {
      setIsLiked(wasLiked);
      setLikeCount(wasLiked ? likeCount : likeCount - 1);
      toast.error(
        <div>
          <span className="emoji">😢</span> {error?.data?.message || error.message || 'Failed to add reaction'}
        </div>,
        { icon: false }
      );
    } finally {
      setTimeout(() => setIsAnimating(false), 1000);
      setShowEmojiPicker(false);
    }
  };

  const emojiPicker = (
    <Popover id="emoji-picker-popover" onMouseLeave={() => setShowEmojiPicker(false)}>
      <Popover.Body className="d-flex gap-2 p-2">
        {emojiOptions.map((emoji) => (
          <div
            key={emoji.label}
            className="emoji-option"
            onClick={() => handleLike(emoji.value)}
            onMouseEnter={() => setSelectedEmoji(emoji.value)}
            role="button"
            tabIndex={0}
            aria-label={emoji.label}
          >
            <FontAwesomeIcon icon={emoji.icon} className="fs-5" />
          </div>
        ))}
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="position-relative d-inline-block">
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="top"
        show={showEmojiPicker}
        onToggle={setShowEmojiPicker}
        overlay={emojiPicker}
        delay={{ show: 300, hide: 500 }}
      >
        <Button 
          variant={isLiked ? "primary" : "outline-primary"}
          onClick={() => handleLike()}
          onMouseEnter={() => setShowEmojiPicker(true)}
          className={`like-button ${isAnimating ? 'pulse' : ''}`}
          disabled={!userInfo}
          aria-label={isLiked ? 'Remove reaction' : 'Add reaction'}
        >
          <span className="emoji me-1">{selectedEmoji}</span>
          <span className="like-text">{isLiked ? 'Reacted' : 'React'}</span>
          <span className="like-count">({likeCount})</span>
        </Button>
      </OverlayTrigger>
      
      <style jsx>{`
        .like-button {
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          padding: 0.375rem 0.75rem;
        }
        .emoji-option {
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        .emoji-option:hover {
          transform: scale(1.2);
          background-color: rgba(0,0,0,0.1);
        }
        .pulse {
          animation: pulse 0.5s ease;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .like-count {
          margin-left: 4px;
          font-weight: bold;
        }
        .like-text {
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
};

export default LikeButton;
