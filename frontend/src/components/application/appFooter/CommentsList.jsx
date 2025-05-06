import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faReply } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';

import DeleteComment from '../comment/DeleteComment';
import EditComment from '../comment/EditComment';
import LikeToComment from '../comment/LikeToComment';
import RepliesList from '../comment/RepliesList';
import ReplyForm from '../reply/ReplyForm';
import LinkPreviewCard from '../../shared/LinkPreviewCard';

import '../../../assets/styles/commentList.css';

const CommentsList = ({ comments = [], appId, currentUserId, isAdmin = false }) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [collapsedReplies, setCollapsedReplies] = useState({});

  useEffect(() => {
    const initialCollapsed = {};
    comments.forEach((comment) => {
      if (comment.replies?.length) {
        initialCollapsed[comment._id] = true;
      }
    });
    setCollapsedReplies(initialCollapsed);
  }, [comments]);

  const toggleReplies = (commentId) => {
    setCollapsedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const getAuthorName = (user) => {
    return user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Anonymous';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Just now' : formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  const totalCommentsCount = comments.reduce(
    (total, comment) => total + 1 + (comment.replies?.length || 0),
    0
  );

  return (
    <div className="comments-container">
      <h6 className="comments-title">Comments ({totalCommentsCount})</h6>

      {comments.length > 0 ? (
        <ul className="comments-list" style={{ listStyle: 'none', padding: 0 }}>
          {comments.map((comment) => (
            <li key={comment._id} className="comment-item">
              <div className="comment-row">
                <div className="avatar-circle" style={{ cursor: 'pointer' }}>
                  <img
                    src={comment.avatar || '/SHCAPL-logo.jpg'}
                    alt={comment.name || 'User'}
                    loading="lazy"
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <div className="comment-content-wrapper">
                  <div className="comment-header">
                    <div className="comment-author">
                      <strong style={{ cursor: 'pointer' }}>{getAuthorName(comment)}</strong>
                      {comment.isAuthor && (
                        <span className="author-title" style={{ cursor: 'pointer' }}>▼ Author</span>
                      )}
                      <span className="comment-time" style={{ cursor: 'pointer' }}>
                        {formatDate(comment.createdAt)}
                        {comment.isEdited && (
                          <span className="edited-badge" style={{ cursor: 'pointer' }}> (edited)</span>
                        )}
                      </span>
                    </div>

                    {(currentUserId === comment.user || isAdmin) && !editingCommentId && (
                      <div className="comment-actions">
                        <button
                          className="comment-action-btn edit-btn"
                          onClick={() => setEditingCommentId(comment._id)}
                          aria-label="Edit comment"
                          style={{ cursor: 'pointer' }}
                        >
                          <FontAwesomeIcon icon={faEdit} style={{ cursor: 'pointer' }} />
                        </button>
                        <DeleteComment 
                          commentId={comment._id} 
                          appId={appId} 
                          style={{ cursor: 'pointer' }}
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
                      <>
                        {comment.comment && <p style={{ cursor: 'pointer' }}>{comment.comment}</p>}
                        {comment.linkPreview?.url && (
                          <LinkPreviewCard 
                            linkPreview={comment.linkPreview} 
                            style={{ cursor: 'pointer' }}
                          />
                        )}
                      </>
                    )}
                  </div>

                  <div className="comment-footer">
                    <LikeToComment
                      appId={appId}
                      commentId={comment._id}
                      likes={comment.likes || []}
                      style={{ cursor: 'pointer' }}
                    />

                    <button
                      className="comment-action-btn"
                      onClick={() => {
                        const isReplying = replyingToCommentId === comment._id;
                        setReplyingToCommentId(isReplying ? null : comment._id);
                        if (isReplying) {
                          setCollapsedReplies((prev) => ({
                            ...prev,
                            [comment._id]: false,
                          }));
                        }
                      }}
                      aria-label={
                        replyingToCommentId === comment._id ? 'Cancel reply' : 'Reply to comment'
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={faReply} style={{ cursor: 'pointer' }} />
                      <span className="action-count" style={{ cursor: 'pointer' }}>
                        {comment.replies?.length || 0}
                      </span>
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
                    setCollapsedReplies((prev) => ({
                      ...prev,
                      [comment._id]: false,
                    }));
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
        <p className="no-comments" style={{ cursor: 'pointer' }}>No comments yet</p>
      )}
    </div>
  );
};

export default CommentsList;