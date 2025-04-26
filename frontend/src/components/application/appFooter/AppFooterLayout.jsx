import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import AddCommentForm from './AddCommentForm';
import { Button } from 'react-bootstrap';

const AppFooterLayout = ({
  application,
  userInfo,
  onLikeSuccess,
  onShareSuccess,
  onToggleComments,
  showComments,
  onCommentAddHandler,
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const navigate = useNavigate();

  const handleCommentButtonClick = () => {
    if (!userInfo) {
      toast.error('Please login to comment on applications');
      navigate('/login');
      return;
    }
    setShowCommentForm(prev => !prev);
    if (!showComments) onToggleComments();
  };

  const handleAddComment = (newComment) => {
    onCommentAddHandler(newComment);
    setShowCommentForm(false);
  };

  const handleCancelComment = () => {
    setShowCommentForm(false);
  };

  const commentCount = (application.metrics?.commentsCount || 0) + (application.metrics?.repliesCount || 0);

  return (
    <>
      {/* Footer Actions */}
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
            {commentCount > 0 && <span className="ms-1">({commentCount})</span>}
          </Button>

          <ShareButton
            application={application}
            onShareSuccess={onShareSuccess}
          />
        </div>
      </div>

      {/* Comment Form - Rendered below footer but controlled by footer */}
      {showCommentForm && (
        <div className="px-3 pb-3">
          <AddCommentForm
            application={application}
            onAddComment={handleAddComment}
            onCancel={handleCancelComment}
          />
        </div>
      )}
    </>
  );
};

export default AppFooterLayout;