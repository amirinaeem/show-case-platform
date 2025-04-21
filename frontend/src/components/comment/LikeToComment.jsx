import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useLikeCommentMutation } from '../../slices/applicationsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const LikeToComment = ({ appId, onLikeToComment, commentId, likes = [] }) => {
  const [likeComment] = useLikeCommentMutation();
  const { userInfo } = useSelector(state => state.auth);
  const toastId = React.useRef(null);

  const isLiked = userInfo?._id && likes.includes(userInfo._id);
  const likeCount = likes?.length || 0;

  const handleLike = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      toastId.current = toast.loading('Updating like...');
      
      const likedComment = await likeComment({ 
        appId,
        commentId
      }).unwrap();

      onLikeToComment?.(likedComment);
      
      toast.update(toastId.current, {
        render: isLiked ? 'Comment unliked' : 'Comment liked!',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      console.error('Failed to update like:', error);
      toast.update(toastId.current, {
        render: error.data?.message || 'Failed to update like',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  return (
    <button 
      className={`comment-action-btn ${isLiked ? 'liked' : ''}`}
      onClick={handleLike}
      aria-label={isLiked ? 'Unlike comment' : 'Like comment'}
      disabled={!userInfo}
    >
      <FontAwesomeIcon icon={faThumbsUp} />
      {likeCount > 0 && <span className="action-count">{likeCount}</span>}
    </button>
  );
};

export default React.memo(LikeToComment);