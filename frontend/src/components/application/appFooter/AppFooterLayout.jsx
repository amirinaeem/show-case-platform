import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import AddCommentForm from './AddCommentForm';
import CommentsList from './CommentsList';

const AppFooterLayout = ({
  appId,
  comments,
  likes = [],
  metrics = {},
  userInfo,
  onToggleComments,
  showComments,
  onAddComment
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
    if (!showComments) {
      onToggleComments();
    }
  };

  const handleCancelComment = () => {
    setShowCommentForm(false);
  };


  const commentCount = (metrics.commentsCount || 0) + (metrics.repliesCount || 0);

  return (
    <>
      {/* Footer Actions */}
      <div className="m-2 app-actions-container">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <LikeButton
            appId={appId}
            likes={likes}
          />

          <Button
            variant={showCommentForm ? 'primary' : 'outline-secondary'}
            className={`comment-button ${showCommentForm ? 'active' : ''}`}
            onClick={handleCommentButtonClick}
            aria-expanded={showCommentForm}
            aria-label={showCommentForm ? 'Hide comment form' : 'Show comment form'}
          >
            <i className="far fa-comment me-1"></i> Comment
            {commentCount > 0 && (
              <span className="ms-1 badge bg-secondary">
                {commentCount}
              </span>
            )}
          </Button>

          <ShareButton appId={appId} />
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="px-3 pb-3" aria-live="polite">
          <AddCommentForm
            appId={appId}
            onCancel={handleCancelComment}
          />

        <CommentsList 
            comments={comments}
            appId={appId}
            currentUserId={userInfo?._id}
            isAdmin={userInfo?.isAdmin || false}
          />

        </div>
      )}
    </>
  );
};

export default AppFooterLayout;