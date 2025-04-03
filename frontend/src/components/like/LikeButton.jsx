import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useLikeApplicationMutation } from '../../slices/applicationsSlice';
import { optimisticLikeUpdate } from '../../utils/optimisticUpdates';

const LikeButton = ({ application, userInfo, onLikeSuccess }) => {
  const [likeApplication] = useLikeApplicationMutation();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    application.metrics?.likes || application.likes?.length || 0
  );
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(userInfo && application.likes?.includes(userInfo._id));
  }, [userInfo, application.likes]);

  const handleLike = async () => {
    if (!userInfo) {
      toast.error('Please login to like applications');
      navigate('/login'); // Redirect to login page
      return;
    }

    const { isLiked: newLikedState, likeCount: newLikeCount } = 
      optimisticLikeUpdate.getUpdatedLikeState(application, userInfo._id);

    // Optimistic update
    setIsLiked(newLikedState);
    setLikeCount(newLikeCount);

    try {
      const result = await likeApplication(application._id).unwrap();
      onLikeSuccess?.(result);
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikeCount(newLikedState ? newLikeCount - 1 : newLikeCount + 1);
      toast.error(error.data?.message || 'Failed to update like');
    }
  };

  return (
    <Button 
      variant={isLiked ? "primary" : "outline-primary"}
      onClick={handleLike}
      disabled={!userInfo}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <i className={`bi ${isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} />
      <span className="ms-1">Like</span>
      {likeCount > 0 && <span className="ms-1">({likeCount})</span>}
    </Button>
  );
};

export default LikeButton