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
}) => {
  const [toggleState, setToggleState] = useState(false); // unified toggle
  const [showCommentForm, setShowCommentForm] = useState(false);
  const navigate = useNavigate();

  const handleCommentButtonClick = () => {
    if (!userInfo) {
      toast.error('Please login to comment on applications');
      navigate('/login');
      return;
    }

    const nextState = !toggleState; // invert both states
    setToggleState(nextState);
    setShowCommentForm(nextState);
  };

  const handleCancelComment = () => {
    setShowCommentForm(false); // only hides the form, does NOT affect toggleState
  };

  const commentCount = (metrics.commentsCount || 0) + (metrics.repliesCount || 0);

  return (
    <>
      <div className="m-2 app-actions-container">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <LikeButton appId={appId} likes={likes} />

          <Button
            variant={showCommentForm ? 'primary' : 'outline-secondary'}
            className={`comment-button ${showCommentForm ? 'active' : ''}`}
            onClick={handleCommentButtonClick}
            aria-expanded={showCommentForm}
            aria-label={showCommentForm ? 'Hide comment form' : 'Show comment form'}
          >
            <i className="far fa-comment me-1"></i> Comment
            {commentCount > 0 && (
              <span className="ms-2 badge bg-light text-dark border rounded-pill px-2">
                {commentCount}
              </span>
            )}
          </Button>

          <ShareButton appId={appId} />
        </div>
      </div>

      {showCommentForm && (
        <div className="px-3 pb-3" aria-live="polite">
          <AddCommentForm appId={appId} onCancel={handleCancelComment} />
        </div>
      )}

      {toggleState && (
        <CommentsList
          comments={comments}
          appId={appId}
          currentUserId={userInfo?._id}
          isAdmin={userInfo?.isAdmin || false}
        />
      )}
    </>
  );
};

export default AppFooterLayout;
