
import LikeButton from '../like/LikeButton';
import ShareButton from '../share/ShareButton';
import CommentButton from '../comment/CommentButton';

const ApplicationActions = ({
  application,
  userInfo,
  showCommentSection,
  toggleCommentSection,
  totalComments,
  onLikeSuccess,
  onShareSuccess
}) => {
  return (
    <div className="d-flex justify-content-between p-4">
      <LikeButton 
        application={application}
        userInfo={userInfo}
        onLikeSuccess={onLikeSuccess}
      />
      
      <CommentButton 
        showCommentSection={showCommentSection}
        toggleCommentSection={toggleCommentSection}
        totalComments={totalComments}
        userInfo={userInfo}
      />
      
      <ShareButton 
        application={application}
        onShareSuccess={onShareSuccess}
      />
    </div>
  );
};

export default ApplicationActions;