import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useLikeApplicationMutation } from '../../../slices/applicationsSlice';

const LikeButton = ({ application, userInfo, onLikeSuccess }) => {
  const [likeApplication] = useLikeApplicationMutation();
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(userInfo && application.likes?.includes(userInfo._id));
  }, [userInfo, application.likes]);

  const handleLike = async () => {
    if (!userInfo) {
      toast.error('Please login to like applications');
      navigate('/login');
      return;
    }

    try {
      const result = await likeApplication(application._id).unwrap();
      onLikeSuccess?.(result);
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update like');
    }
  };

  // Get like count from application metrics or likes array
  const likeCount = application.metrics?.likes || application.likes?.length || 0;

  return (
    <Button 
      variant={isLiked ? "primary" : "outline-primary"}
      onClick={handleLike}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <span className="ms-1">Like</span>
      {likeCount > 0 && <span className="ms-1">({likeCount})</span>}
    </Button>
  );
};

export default LikeButton;