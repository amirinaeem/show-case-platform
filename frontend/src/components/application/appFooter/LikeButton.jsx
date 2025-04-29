import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { useLikeApplicationMutation } from '../../../slices/applicationsSlice';

const LikeButton = ({ appId, likes = [] }) => {  // Simplified props
  const [likeApplication] = useLikeApplicationMutation();
  const { userInfo } = useSelector(state => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLiked(userInfo && likes.includes(userInfo._id));
  }, [userInfo, likes]);

  const handleLike = async () => {
    if (!userInfo) {
      toast.error('Please login to like applications');
      navigate('/login');
      return;
    }

    try {
      await likeApplication(appId).unwrap();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update like');
    }
  };

  return (
    <Button 
      variant={isLiked ? "primary" : "outline-primary"}
      onClick={handleLike}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <span className="ms-1">Like</span>
      {likes.length > 0 && <span className="ms-1">({likes.length})</span>}
    </Button>
  );
};

export default LikeButton;