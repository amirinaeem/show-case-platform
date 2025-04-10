import { useState } from 'react';
import { Button } from 'react-bootstrap';
import LikeButton from '../like/LikeButton';
import ShareButton from '../share/ShareButton';
import AddComment from '../comment/AddComment';

const AppFooterHandlers = ({
  application,
  userInfo,
  onLikeSuccess,
  onCommentSuccess,
  onShareSuccess,
  onToggleComments,
  showComments
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleCommentButtonClick = () => {
    onToggleComments()
    setShowCommentForm(prev => !prev);
    setShowCommentForm(true);
  };

  const handleCommentSuccess = (result) => {
    onCommentSuccess(result);
    setShowCommentForm(true);
    if (!showComments) {
      onToggleComments()
    }
  };

  return (
    <div className="m-2 app-actions-container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <LikeButton 
          application={application}
          userInfo={userInfo}
          onLikeSuccess={onLikeSuccess}
        />
        
        <Button
        variant={showCommentForm ? 'primary' : 'outline-secondary'}
        className={`comment-button ${showCommentForm ? 'active' : ''}`}
        onClick={handleCommentButtonClick}
        >
       <i className="far fa-comment me-1"></i> Comment
       {application.metrics?.commentsCount > 0 && (
        <span className="ms-1">({application.metrics.commentsCount})</span>
        )}
      </Button>
        
        <ShareButton 
          application={application}
          onShareSuccess={onShareSuccess}
        />
      </div>
      
      {/* Show comment form when either comments are visible or form is active */}
      {showComments && showCommentForm && (
        <AddComment
          appId={application._id}
          onCommentSuccess={handleCommentSuccess}
          onCancel={() => setShowCommentForm(false)}
        />
      )}
    </div>
  );
};

export default AppFooterHandlers;