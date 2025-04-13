import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import DeleteComment from './DeleteComment';
import EditComment from './EditComment';
import { formatDistanceToNow } from 'date-fns';

const CommentsList = ({ 
  comments = [], 
  appId, 
  currentUserId, 
  isAdmin = false,
  onCommentUpdate 
}) => {
  const [editingCommentId, setEditingCommentId] = useState(null);

  // Filter out duplicate optimistic comments while preserving all others
  const filteredComments = comments.reduce((acc, comment) => {
    if (comment.isOptimistic) {
      const exists = acc.some(c => c._id === comment._id && c.isOptimistic);
      if (!exists) acc.push(comment);
    } else {
      acc.push(comment);
    }
    return acc;
  }, []);

  return (
    <Card.Body className="p-3">
      {filteredComments.length > 0 ? (
        <>
          <Card.Title as="h6" className="mb-3">
            Comments ({filteredComments.length})
          </Card.Title>
          {filteredComments.map((comment) => (
            <div key={comment._id} className="mb-3 p-2 border-bottom">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <img 
                    src={comment.avatar || '/SHCAPL-logo.jpg'} 
                    alt={comment.name || 'User'} 
                    className="rounded-circle me-2" 
                    width="32" 
                    height="32" 
                    loading="lazy"
                  />
                  <div>
                    <strong className="me-2">{comment.name || ''}</strong>
                    <small className="text-muted">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      {comment.isEdited && <span className="ms-2 text-muted">(edited)</span>}
                    </small>
                  </div>
                </div>

                {(currentUserId === comment.user || isAdmin) && !editingCommentId && (
                  <div className="d-flex">
                    <button
                      className="btn btn-link text-primary p-0 me-2"
                      onClick={() => setEditingCommentId(comment._id)}
                      aria-label="Edit comment"
                    >
                      <FontAwesomeIcon icon={faEdit} size="sm" />
                    </button>
                    <DeleteComment
                      commentId={comment._id}
                      appId={appId}
                      userId={currentUserId}
                      commentUserId={comment.user}
                      isAdmin={isAdmin}
                    />
                  </div>
                )}
              </div>

              {editingCommentId === comment._id ? (
                <EditComment
                  appId={appId}
                  commentId={comment._id}
                  currentText={comment.comment}
                  onSuccess={(updatedComment) => {
                    setEditingCommentId(null);
                    onCommentUpdate?.(updatedComment);
                  }}
                  onCancel={() => setEditingCommentId(null)}
                />
              ) : (
                <p className="mb-1 mt-2">{comment.comment}</p>
              )}

              <div className="d-flex justify-content-between">
                <small className="text-muted">
                  {comment.likes?.length > 0 && (
                    <span>{comment.likes.length} likes</span>
                  )}
                </small>
              </div>
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