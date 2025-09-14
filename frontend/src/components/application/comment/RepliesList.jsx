import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import DeleteReply from '../reply/DeleteReply';
import EditReply from '../reply/EditReply';
import LikeToReply from '../reply/LikeToReply';
import LinkPreviewCard from '../../shared/LinkPreviewCard';
import '../../../assets/styles/commentList.css';

const RepliesList = ({
  comment,
  appId,
  currentUserId,
  isAdmin,
  getAuthorName,
  formatDate,
}) => {
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [showAllReplies, setShowAllReplies] = useState(false);

  if (!comment.replies?.length) return null;

  // Sort replies by date (newest first) and get visible replies
  const sortedReplies = [...comment.replies].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  const visibleReplies = showAllReplies 
    ? sortedReplies 
    : sortedReplies.slice(0, 5);

  const hiddenRepliesCount = Math.max(0, sortedReplies.length - 5);

  return (
    <div className="replies-container">
      <ul className="replies-list">
        {visibleReplies.map((reply) => (
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
                  src={reply.avatar || '/images/logo.jpg'}
                  alt={reply.name || 'User'}
                  loading="lazy"
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
                      {editingReplyId !== reply._id && (
                        <>
                          <button
                            className="comment-action-btn edit-btn"
                            onClick={() => setEditingReplyId(reply._id)}
                            aria-label="Edit reply"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <DeleteReply
                            commentId={comment._id}
                            replyId={reply._id}
                            appId={appId}
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
                      onCancel={() => setEditingReplyId(null)}
                    />
                  ) : (
                    <>
                      <p>{reply.reply}</p>
                      {reply.linkPreview && (
                        <LinkPreviewCard linkPreview={reply.linkPreview} />
                      )}
                    </>
                  )}
                </div>

                <div className="comment-footer">
                  <LikeToReply
                    appId={appId}
                    commentId={comment._id}
                    replyId={reply._id}
                    likes={reply.likes || []}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hiddenRepliesCount > 0 && (
        <button
          className="toggle-replies-btn"
          onClick={() => setShowAllReplies(!showAllReplies)}
          aria-expanded={showAllReplies}
        >
          <FontAwesomeIcon icon={showAllReplies ? faChevronUp : faChevronDown} />
          {showAllReplies 
            ? 'Show fewer replies' 
            : `Show ${hiddenRepliesCount} more ${hiddenRepliesCount === 1 ? 'reply' : 'replies'}`}
        </button>
      )}
    </div>
  );
};

export default RepliesList;