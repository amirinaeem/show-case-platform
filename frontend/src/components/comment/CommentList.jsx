import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faReply, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import DeleteComment from './DeleteComment';
import EditComment from './EditComment';
import ReplyToComment from './ReplyToComment';
import LikeToComment from './LikeToComment';
import LikeToReply from './LikeToReply';
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
  const [collapsedReplies, setCollapsedReplies] = useState(
    comments.reduce((acc, comment) => {
      if (comment.replies?.length) acc[comment._id] = true;
      return acc;
    }, {})
  );

  const toggleReplies = (commentId) => {
    setCollapsedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const getCommentAuthorName = (comment) => {
    if (!comment?.name) return 'Anonymous';
    return comment.name[0].toUpperCase() + comment.name.slice(1);
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
              {/* Comment Row */}
              <div className="comment-row">
                <div className="avatar-circle">
                  <img 
                    src={comment.avatar || '/SHCAPL-logo.jpg'} 
                    alt={comment.name || 'User'} 
                  />
                </div>
                
                <div className="comment-content-wrapper">
                  <div className="comment-header">
                    <div className="comment-author">
                      <strong>{getCommentAuthorName(comment)}</strong>
                      {comment.isAuthor && <span className="author-title">▼ Author</span>}
                      <span className="comment-time">
                        {formatDate(comment.createdAt)}
                        {comment.isEdited && <span className="edited-badge"> (edited)</span>}
                      </span>
                    </div>

                    <div className="comment-actions">
                      {(currentUserId === comment.user || isAdmin) && !editingCommentId && (
                        <>
                          <button
                            className="comment-action-btn edit-btn"
                            onClick={() => setEditingCommentId(comment._id)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <DeleteComment
                            commentId={comment._id}
                            appId={appId}
                            userId={currentUserId}
                            onDeleteComment={(deletedComment) => onCommentUpdate(deletedComment)}
                            commentUserId={comment.user}
                            isAdmin={isAdmin}
                          />
                        </>
                      )}
                    </div>
                  </div>

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

                  <div className="comment-footer">
                    <LikeToComment
                      appId={appId}
                      commentId={comment._id}
                      likes={comment.likes || []}
                      onLikeToComment={(likedComment) => {
                        onCommentUpdate?.(likedComment);
                      }}
                    />

                    <button 
                      className="comment-action-btn"
                      onClick={() => setReplyingToCommentId(
                        replyingToCommentId === comment._id ? null : comment._id
                      )}
                    >
                      <FontAwesomeIcon icon={faReply} />
                      <span className="action-count">{comment.replies?.length || 0}</span>
                    </button>
                  </div>
                </div>
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

              {/* Replies Section */}
              {comment.replies?.length > 0 && (
                <div className="replies-container">
                  <button 
                    className="toggle-replies-btn"
                    onClick={() => toggleReplies(comment._id)}
                  >
                    <FontAwesomeIcon 
                      icon={collapsedReplies[comment._id] ? faChevronDown : faChevronUp} 
                    />
                    {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                  </button>

                  {!collapsedReplies[comment._id] && (
                    <ul className="replies-list">
                      {comment.replies.map((reply) => (
                        <li key={reply._id} className="reply-item">
                          <svg className="reply-connector" width="40" height="60">
                            <path 
                              d="M20 0 V 20 H 40 V 40"
                              stroke="#6c757d"
                              strokeWidth="1.5"
                              fill="none"
                              markerEnd="url(#arrowhead)"
                            />
                          </svg>
                          
                          <div className="comment-row">
                            <div className="avatar-circle small">
                              <img 
                                src={reply.avatar || '/SHCAPL-logo.jpg'} 
                                alt={reply.name || 'User'} 
                              />
                            </div>
                            
                            <div className="comment-content-wrapper">
                              <div className="comment-header">
                                <div className="comment-author">
                                  <strong>{reply.name || 'Anonymous'}</strong>
                                  <span className="comment-time">
                                    {formatDate(reply.createdAt)}
                                    {reply.isEdited && <span className="edited-badge"> (edited)</span>}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="comment-content">
                                <p>{reply.reply}</p>
                              </div>
                              
                              <div className="comment-footer">
                                <LikeToReply
                                  appId={appId}
                                  commentId={comment._id}
                                  replyId={reply._id}
                                  likes={reply.likes || []}
                                  onLikeToReply={(likedReply) => {
                                    onCommentUpdate?.(likedReply);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
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