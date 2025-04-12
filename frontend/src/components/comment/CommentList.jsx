import { Card } from 'react-bootstrap';
import DeleteComment from './DeleteComment';

const CommentsList = ({ comments = [], appId, currentUserId, isAdmin = false }) => {
  
  return (
    <Card.Body className="p-3">
      {comments.length > 0 ? (
        <>
          <Card.Title as="h6" className="mb-3">
            Comments ({comments.length})
          </Card.Title>
          {comments.map((comment) => (
            <div key={comment._id} className="mb-3 p-2">
              <div className="d-flex align-items-center">
                <img 
                  src={comment.avatar || '/SHCAPL-logo.jpg'} 
                  alt={comment.name || 'User'} 
                  className="rounded-circle me-2" 
                  width="32" 
                  height="32" 
                />
                <strong className="me-2">{comment.name || 'Anonymous'}</strong>
                <DeleteComment
                  commentId={comment._id}
                  appId={appId}  
                  userId={currentUserId}
                  commentUserId={comment.user}
                  isAdmin={isAdmin}
                />
              </div>
              <p className="mb-1 mt-2">{comment.comment}</p>
              <small className="text-muted">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </>
      ) : (
        <p className="text-muted">No comments yet</p>
      )}
    </Card.Body>
  );
};

export default CommentsList;