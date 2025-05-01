import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faReply } from '@fortawesome/free-solid-svg-icons';
import DeleteComment from '../comment/DeleteComment';
import EditComment from '../comment/EditComment';
import LikeToComment from '../comment/LikeToComment';
import RepliesList from '../comment/RepliesList';
import ReplyForm from '../reply/ReplyForm';
import { formatDistanceToNow } from 'date-fns';
import '../../../assets/styles/commentList.css';

const CommentsList = ({ 
  comments = [], 
  appId, 
  currentUserId, 
  isAdmin = false,
}) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [collapsedReplies, setCollapsedReplies] = useState({});

  // Initialize collapsed state
  useEffect(() => {
    const initialCollapsed = {};
    comments.forEach(comment => {
      if (comment.replies?.length) {
        initialCollapsed[comment._id] = true;
      }
    });
    setCollapsedReplies(initialCollapsed);
  }, [comments]);

  const toggleReplies = (commentId) => {
    setCollapsedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const getAuthorName = (user) => {
    if (!user?.name) return 'Anonymous';
    return user.name[0].toUpperCase() + user.name.slice(1);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Just now' : formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  const totalCommentsCount = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  

  return (
    <div className="comments-container">
      <h6 className="comments-title">Comments ({totalCommentsCount})</h6>
      
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment._id} className="comment-item">
              <div className="comment-row">
                <div className="avatar-circle">
                  <img 
                    src={comment.avatar || '/SHCAPL-logo.jpg'} 
                    alt={comment.name || 'User'} 
                    loading="lazy"
                  />
                </div>
                
                <div className="comment-content-wrapper">
                  <div className="comment-header">
                    <div className="comment-author">
                      <strong>{getAuthorName(comment)}</strong>
                      {comment.isAuthor && <span className="author-title">▼ Author</span>}
                      <span className="comment-time">
                        {formatDate(comment.createdAt)}
                        {comment.isEdited && <span className="edited-badge"> (edited)</span>}
                      </span>
                    </div>

                    {(currentUserId === comment.user || isAdmin) && !editingCommentId && (
                      <div className="comment-actions">
                        <button
                          className="comment-action-btn edit-btn"
                          onClick={() => setEditingCommentId(comment._id)}
                          aria-label="Edit comment"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <DeleteComment
                          commentId={comment._id}
                          appId={appId}
                        />
                      </div>
                    )}
                  </div>

                  <div className="comment-content">
                    {editingCommentId === comment._id ? (
                      <EditComment
                        appId={appId}
                        commentId={comment._id}
                        currentText={comment.comment}
                        onCancel={() => setEditingCommentId(null)}
                      />
                    ) : (
                      <p>{comment.comment}</p>
                    )}
                  </div>

                  <div className="comment-footer">
                    <LikeToComment
                      appId={appId}
                      commentId={comment._id}
                      likes={comment.likes || []}
                    />

                    <button 
                      className="comment-action-btn"
                      onClick={() => setReplyingToCommentId(
                        replyingToCommentId === comment._id ? null : comment._id
                      )}
                      aria-label={replyingToCommentId === comment._id ? 'Cancel reply' : 'Reply to comment'}
                    >
                      <FontAwesomeIcon icon={faReply} />
                      <span className="action-count">{comment.replies?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>

              {replyingToCommentId === comment._id && (
                <ReplyForm
                  appId={appId}
                  commentId={comment._id}
                  onSuccess={() => {
                    setReplyingToCommentId(null);
                  }}
                  onCancel={() => setReplyingToCommentId(null)}
                />
              )}

              <RepliesList
                comment={comment}
                appId={appId}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                collapsedReplies={collapsedReplies}
                toggleReplies={toggleReplies}
                getAuthorName={getAuthorName}
                formatDate={formatDate}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-comments">No comments yet</p>
      )}
    </div>
  );
};

export default CommentsList;