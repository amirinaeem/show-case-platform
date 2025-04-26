import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import DeleteComment from './DeleteComment';
import EditReply from '../reply/EditReply';
import LikeToReply from '../reply/LikeToReply';
import '../../../assets/styles/commentList.css';

const RepliesList = ({
  comment,
  appId,
  currentUserId,
  isAdmin,
  collapsedReplies,
  toggleReplies,
  onEditReplyHandler,
  onLikeToReplyHandler,
  getAuthorName,
  formatDate
}) => {
  const [editingReplyId, setEditingReplyId] = useState(null);

  if (!comment.replies?.length) return null;

  return (
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
                      <strong>{getAuthorName(reply)}</strong>
                      <span className="comment-time">
                        {formatDate(reply.createdAt)}
                        {reply.isEdited && <span className="edited-badge"> (edited)</span>}
                      </span>
                    </div>
                    
                    {(currentUserId === reply.user || isAdmin) && (
                      <div className="comment-actions">
                        {editingReplyId === reply._id ? null : (
                          <>
                            <button
                              className="comment-action-btn edit-btn"
                              onClick={() => setEditingReplyId(reply._id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <DeleteComment
                              commentId={comment._id}
                              replyId={reply._id}
                              appId={appId}
                              onDeleteComment={(deletedReply) => {
                                onEditReplyHandler?.({
                                  ...comment,
                                  replies: comment.replies.filter(r => r._id !== deletedReply._id)
                                });
                              }}
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="comment-content">
                    {editingReplyId === reply._id ? (
                      <EditReply
                        appId={appId}
                        commentId={comment._id}
                        replyId={reply._id}
                        currentText={reply.reply}
                        onEditReply={(editedReply) => {
                          setEditingReplyId(null);
                          onEditReplyHandler?.({
                            ...comment,
                            replies: comment.replies.map(r => 
                              r._id === reply._id ? editedReply : r
                            )
                          });
                        }}
                        onCancel={() => setEditingReplyId(null)}
                      />
                    ) : (
                      <p>{reply.reply}</p>
                    )}
                  </div>
                  
                  <div className="comment-footer">
                    <LikeToReply
                      appId={appId}
                      commentId={comment._id}
                      replyId={reply._id}
                      likes={reply.likes || []}
                      onLikeToReply={(likedReply) => {
                        onLikeToReplyHandler?.({
                          ...comment,
                          replies: comment.replies.map(r => 
                            r._id === reply._id ? likedReply : r
                          )
                        });
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
  );
};

export default RepliesList;