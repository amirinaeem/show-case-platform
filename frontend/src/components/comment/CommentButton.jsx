// components/CommentButton.js
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const CommentButton = ({ 
  showCommentSection, 
  toggleCommentSection, 
  totalComments,
  userInfo 
}) => {
  const handleClick = () => {
    if (!userInfo) {
      toast.error('Please login to comment');
      return;
    }
    toggleCommentSection();
  };

  return (
    <Button 
      variant={showCommentSection ? "secondary" : "outline-primary"}
      onClick={handleClick}
      className="action-btn"
      aria-label="Toggle comment section"
    >
      <i className="fas fa-comment me-2"></i> 
      Comment ({totalComments})
    </Button>
  );
};

export default CommentButton;