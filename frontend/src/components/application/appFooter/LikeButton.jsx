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

  const [likesCount, setLikesCount] = useState(likes.length);

useEffect(() => {
  setIsLiked(userInfo && likes.includes(userInfo._id));
  setLikesCount(likes.length);
}, [userInfo, likes]);

const handleLike = async () => {
  if (!userInfo) {
    toast.error('Please login to like applications');
    navigate('/login');
    return;
  }

  const liked = !isLiked;
  setIsLiked(liked);
  setLikesCount(prev => liked ? prev + 1 : Math.max(0, prev - 1));

  try {
    await likeApplication(appId).unwrap();
  } catch (error) {
    // Rollback
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev + 1 : Math.max(0, prev - 1));
    toast.error(error.data?.message || 'Failed to update like');
  }
};

  

  return (
    <Button 
     variant={isLiked ? "primary" : "outline-primary"}
     onClick={handleLike}
     aria-label={isLiked ? 'Unlike' : 'Like'}
    >
    <i className={`bi ${isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} />
    <span className="ms-1">Like</span>
    {likesCount > 0 && (
    <span className="ms-2 badge bg-light text-dark border rounded-pill px-2">
      {likesCount}
    </span>
    )}
   </Button>

  );
};

export default LikeButton;