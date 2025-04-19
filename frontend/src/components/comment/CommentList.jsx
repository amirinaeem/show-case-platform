import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faReply, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import DeleteComment from './DeleteComment';
import EditComment from './EditComment';
import ReplyToComment from './ReplyToComment';
import { formatDistanceToNow } from 'date-fns';
import '../../assets/styles/commentList.css';

const CommentsList = ({ 
  comments = [], 
  appId, 
  currentUserId, 
  isAdmin = false,
  onCommentUpdate 
}) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  // Combine comments and replies for total count
  const totalCommentsCount = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0)

  return (
    <Card.Body className="comments-container">
      <Card.Title as="h6" className="comments-title">
        Comments ({totalCommentsCount})
      </Card.Title>
      
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment._id} className="comment-item">
              {/* Comment Header */}
              <div className="comment-header">
                <div className="comment-author">
                  <img 
                    src={comment.avatar || '/SHCAPL-logo.jpg'} 
                    alt={comment.name || 'User'} 
                    className="comment-avatar"
                  />
                  <div>
                    <strong className="author-name">{comment.name || ''}</strong>
                    <span className="author-title">▼ Author</span>
                    <div className="comment-time">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      {comment.isEdited && <span className="edited-badge">(edited)</span>}
                    </div>
                  </div>
                </div>

                {(currentUserId === comment.user || isAdmin) && !editingCommentId && (
                  <div className="comment-actions">
                    <button
                      className="comment-action-btn edit-btn"
                      onClick={() => setEditingCommentId(comment._id)}
                      aria-label="Edit comment"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Edit
                    </button>
                    <DeleteComment
                      commentId={comment._id}
                      appId={appId}
                      userId={currentUserId}
                      onDeleteComment = {(deletedComment)=> onCommentUpdate(deletedComment)}
                      commentUserId={comment.user}
                      isAdmin={isAdmin}
                    />
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="comment-content">
                {editingCommentId === comment._id ? (
                  <EditComment
                    appId={appId}
                    commentId={comment._id}
                    currentText={comment.comment}
                    onEditComment={(editedComment) => {
                      setEditingCommentId(null);
                      onCommentUpdate?.(editedComment);
                    }}
                    onCancel={() => setEditingCommentId(null)}
                  />
                ) : (
                  <p>{comment.comment}</p>
                )}
              </div>

              {/* Comment Footer */}
              <div className="comment-footer">
                <button className="comment-action-btn">
                  <FontAwesomeIcon icon={faThumbsUp} />
                  Like
                  <span className="action-count">{comment.likes?.length || 0}</span>
                </button>
                <button 
                   className="comment-action-btn"
                   onClick={() => setReplyingToCommentId(
                   replyingToCommentId === comment._id ? null : comment._id
                   )}
                   >
                    <FontAwesomeIcon icon={faReply} />
                     Reply
                  <span className="action-count">{comment.replies?.length || 0}</span>
                </button>
              </div>

              {replyingToCommentId === comment._id && (
               <ReplyToComment
                appId={appId}
                commentId={comment._id}
                commentUserId={comment.user}
                onReplyToComment={(repliedComment) => {
                setReplyingToCommentId(null);
                onCommentUpdate?.(repliedComment);
              }}
              />
              )}

              {/* Replies Section with Visual Connector */}
              {comment.replies?.length > 0 && (
                <div className="replies-connector">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="reply-item">
                      <div className="comment-header">
                        <div className="comment-author">
                          <img 
                            src={reply.avatar || '/SHCAPL-logo.jpg'} 
                            alt={reply.name || 'User'} 
                            className="comment-avatar"
                          />
                          <div>
                            <strong className="author-name">{reply.name}</strong>
                            <span className="author-title">• 3rd+</span>
                            <div className="comment-time">
                              {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="comment-content">
                        <p>{reply.reply}</p>
                      </div>
                      <div className="comment-footer">
                        <button className="comment-action-btn">
                          <FontAwesomeIcon icon={faThumbsUp} />
                          Like
                          <span className="action-count">{reply.likes?.length || 0}</span>
            
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-comments">No comments yet</p>
      )}
    </Card.Body>
  );
};

export default CommentsList;