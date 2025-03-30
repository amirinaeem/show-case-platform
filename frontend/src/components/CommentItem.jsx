import { useState } from 'react';
import { toast } from 'react-toastify';
import { ListGroup, Button, Form, Collapse } from 'react-bootstrap';
import { 
  FaEdit, 
  FaTrash, 
  FaReply, 
  FaThumbsUp, 
  FaChevronDown, 
  FaChevronUp 
} from 'react-icons/fa';

const ReplyItem = ({ 
  reply, 
  currentUser, 
  commentId,
  onEditReply, 
  onDeleteReply 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.reply || '');
  const isOwner = currentUser?._id === reply.user;

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== reply.reply) {
      onEditReply(commentId, reply._id, trimmedText);
      setIsEditing(false);
    }
  };

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-start mb-1">
        <div className="d-flex align-items-center">
          <img 
            src={reply.avatar || '/images/default-avatar.png'} 
            alt={reply.name} 
            className="rounded-circle me-2" 
            width="24" 
            height="24" 
            loading="lazy"
          />
          <strong>{reply.name}</strong>
        </div>
        <small className="text-muted">
          {new Date(reply.createdAt).toLocaleString()}
          {reply.isEdited && ' (edited)'}
        </small>
      </div>

      {isEditing ? (
        <Form onSubmit={handleEditSubmit} className="mb-2">
          <Form.Control
            as="textarea"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            aria-label="Edit reply"
            minLength={1}
            maxLength={500}
          />
          <div className="d-flex gap-2 mt-2">
            <Button variant="success" size="sm" type="submit">
              Save
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => setIsEditing(false)}
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <p className="mb-2">{reply.reply}</p>
      )}

      <div className="d-flex gap-2">
        {isOwner && !isEditing && !reply.isOptimistic && (
          <>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => {
                setEditText(reply.reply);
                setIsEditing(true);
              }}
              aria-label="Edit this reply"
            >
              <FaEdit /> Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => onDeleteReply(commentId, reply._id)}
              aria-label="Delete this reply"
            >
              <FaTrash /> Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ 
  comment, 
  currentUser, 
  onEdit,
  onEditToggle,
  onDelete, 
  onReply, 
  isReplying, 
  onAddReply, 
  isEditing,
  onLike,
  onEditReply,
  onDeleteReply,
  setEditingCommentId
}) => {
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState(comment.comment || '');
  const [showReplies, setShowReplies] = useState(false);
  const isOwner = currentUser?._id === comment.user;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    const trimmedReply = replyText.trim();
    if (trimmedReply) {
      onAddReply(comment._id, trimmedReply);
      setReplyText('');
      onReply(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const trimmedText = editText.trim();
    if (!trimmedText) return;
  
    try {
      await onEdit(comment._id, trimmedText);
      setEditingCommentId(null);
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  return (
    <ListGroup.Item className={comment.isOptimistic ? 'opacity-75' : ''}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center">
          <img 
            src={comment.avatar || '/images/default-avatar.png'} 
            alt={comment.name} 
            className="rounded-circle me-2" 
            width="32" 
            height="32" 
            loading="lazy"
          />
          <div>
            <strong>{comment.name}</strong>
            <small className="d-block text-muted">
              {new Date(comment.createdAt).toLocaleString()}
              {comment.isEdited && ' (edited)'}
            </small>
          </div>
        </div>
      </div>

      {isEditing ? (
        <Form onSubmit={handleEditSubmit} className="mb-3">
          <Form.Control
            as="textarea"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="mb-2"
            aria-label="Edit comment"
            minLength={1}
            maxLength={500}
            required
          />
          <div className="d-flex gap-2">
            <Button variant="success" size="sm" type="submit">
              Save
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => onEditToggle(null)}
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <p className="mb-2">{comment.comment}</p>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
        {!comment.replyTo && (  // Only show reply button for top-level comments
          <Button 
            variant={isReplying ? "primary" : "outline-secondary"}
            size="sm"
            onClick={() => onReply(isReplying ? null : comment._id)}
            aria-label={isReplying ? "Cancel reply" : "Reply to comment"}
            disabled={comment.isOptimistic}
          >
            <FaReply /> Reply
          </Button>
        )}
        
        <Button 
          variant={comment.likes?.includes(currentUser?._id) ? "primary" : "outline-secondary"}
          size="sm"
          onClick={() => onLike(comment._id)}
          aria-label="Like this comment"
          disabled={!currentUser || comment.isOptimistic}
        >
          <FaThumbsUp /> {comment.likes?.length || 0}
        </Button>
        
        {isOwner && !isEditing && !comment.isOptimistic && (
          <>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => {
                setEditText(comment.comment);
                onEditToggle(comment._id);
              }}
              aria-label="Edit this comment"
            >
              <FaEdit /> Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => onDelete(comment._id)}
              aria-label="Delete this comment"
            >
              <FaTrash /> Delete
            </Button>
          </>
        )}

        {comment.replies?.length > 0 && (
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            aria-expanded={showReplies}
            aria-label={`${showReplies ? 'Hide' : 'Show'} replies`}
          >
            {showReplies ? <FaChevronUp /> : <FaChevronDown />} 
            Replies ({comment.replies.length})
          </Button>
        )}
      </div>

      {isReplying && !comment.replyTo && (  // Only show reply form for top-level comments
        <Form onSubmit={handleReplySubmit} className="mt-2 ps-3 border-start">
          <Form.Control
            as="textarea"
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="mb-2"
            aria-label="Reply text"
            minLength={1}
            maxLength={500}
            required
          />
          <div className="d-flex gap-2">
            <Button variant="primary" size="sm" type="submit">
              Post Reply
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => onReply(null)}
              aria-label="Cancel reply"
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}

      <Collapse in={showReplies}>
        <div className="mt-3 ps-3 border-start">
          {comment.replies?.map(reply => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              currentUser={currentUser}
              commentId={comment._id}
              onEditReply={onEditReply}
              onDeleteReply={onDeleteReply}
            />
          ))}
        </div>
      </Collapse>
    </ListGroup.Item>
  );
};

export default CommentItem;