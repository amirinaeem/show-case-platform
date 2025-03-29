import { useState } from 'react';
import { ListGroup, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaReply, FaThumbsUp } from 'react-icons/fa';

function CommentItem({ 
  comment, 
  currentUser, 
  onEdit,
  onEditToggle,
  onDelete, 
  onReply, 
  isReplying, 
  onAddReply, 
  isEditing 
}) {
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState(comment.comment);
  const isOwner = currentUser?._id === comment.user;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onAddReply(comment._id, replyText);
      setReplyText('');
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editText.trim() && editText !== comment.comment) {
      onEdit(comment._id, editText);
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
          />
          <strong>{comment.name}</strong>
        </div>
        <small className="text-muted">
          {new Date(comment.createdAt).toLocaleString()}
          {comment.isEdited && ' (edited)'}
          {comment.isOptimistic && ' (Posting...)'}
        </small>
      </div>

      {isEditing ? (
        <Form onSubmit={handleEditSubmit} className="mb-3">
          <Form.Control
            as="textarea"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="mb-2"
          />
          <div className="d-flex gap-2">
            <Button variant="success" size="sm" type="submit">
              Save
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => onEdit(null)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <p className="mb-2">{comment.comment}</p>
      )}

      <div className="d-flex gap-2 mb-3">
        {isOwner && !isEditing && (
          <>
            <Button 
             variant="outline-primary" 
             size="sm"
             onClick={() => {
                setEditText(comment.comment); // Initialize with current comment
               onEdit(comment._id);
               onEditToggle(comment._id)// This should trigger the edit mode
               }}
               >
              <FaEdit /> Edit
              </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => onDelete(comment._id)}
            >
              <FaTrash /> Delete
            </Button>
          </>
        )}
        <Button 
          variant="outline-secondary" 
          size="sm"
          onClick={() => onReply(isReplying ? null : comment._id)}
        >
          <FaReply /> Reply
        </Button>
        <Button variant="outline-secondary" size="sm">
          <FaThumbsUp /> Like ({comment.likes?.length || 0})
        </Button>
      </div>

      {isReplying && (
        <Form onSubmit={handleReplySubmit} className="mt-2 ps-3 border-start">
          <Form.Control
            as="textarea"
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="mb-2"
          />
          <div className="d-flex gap-2">
            <Button variant="primary" size="sm" type="submit">
              Post Reply
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => onReply(null)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-3 ps-3 border-start">
          {comment.replies.map(reply => (
            <div key={reply._id} className="mb-3">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <div className="d-flex align-items-center">
                  <img 
                    src={reply.avatar || '/images/SHCAPL-logo.jpg'} 
                    alt={reply.name} 
                    className="rounded-circle me-2" 
                    width="24" 
                    height="24" 
                  />
                  <strong>{reply.name}</strong>
                </div>
                <small className="text-muted">
                  {new Date(reply.createdAt).toLocaleString()}
                  {reply.isEdited && ' (edited)'}
                  {reply.isOptimistic && ' (Posting...)'}
                </small>
              </div>
              <p className="mb-1">{reply.reply}</p>
            </div>
          ))}
        </div>
      )}
    </ListGroup.Item>
  );
}

export default CommentItem;