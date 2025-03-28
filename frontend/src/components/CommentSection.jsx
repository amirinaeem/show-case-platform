import { useState } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { 
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useAddReplyMutation
} from '../slices/applicationsSlice';
import CommentItem from './CommentItem';

function CommentSection({ appId, comments, onClose, onCommentAction, currentUser }) {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [editComment] = useEditCommentMutation(); // Removed unused isEditing
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [addReply] = useAddReplyMutation(); // Removed unused isReplying

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;
  
    let tempId;
    
    try {
      tempId = `optimistic-${Date.now()}`;
      const optimisticComment = {
        _id: tempId,
        user: currentUser._id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        comment: trimmedComment,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
        replies: []
      };
  
      onCommentAction({
        type: 'ADD_COMMENT',
        comment: optimisticComment
      });
  
      const response = await createComment({
        appId,
        comment: trimmedComment
      }).unwrap();
  
      onCommentAction({
        type: 'UPDATE_COMMENT',
        commentId: tempId,
        updates: response.comment
      });
  
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (error) {
      if (tempId) {
        onCommentAction({
          type: 'DELETE_COMMENT',
          commentId: tempId
        });
      }
      toast.error(error?.data?.message || 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      onCommentAction({
        type: 'UPDATE_COMMENT',
        commentId,
        updates: {
          comment: newText,
          isEdited: true,
          editedAt: new Date().toISOString(),
          isOptimistic: true
        }
      });

      const response = await editComment({
        appId,
        commentId,
        newText
      }).unwrap();

      onCommentAction({
        type: 'UPDATE_COMMENT',
        commentId,
        updates: response.comment
      });

      setEditingComment(null);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ appId, commentId }).unwrap();
      onCommentAction({
        type: 'DELETE_COMMENT',
        commentId
      });
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete comment');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleAddReply = async (commentId, replyText) => {
    try {
      const tempId = `optimistic-reply-${Date.now()}`;
      const optimisticReply = {
        _id: tempId,
        user: currentUser._id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        reply: replyText,
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };

      onCommentAction({
        type: 'ADD_REPLY',
        commentId,
        reply: optimisticReply
      });

      const response = await addReply({
        appId,
        commentId,
        reply: replyText
      }).unwrap();

      onCommentAction({
        type: 'UPDATE_COMMENT',
        commentId,
        updates: {
          replies: (comments.find(c => c._id === commentId)?.replies || [])
            .map(r => r._id === tempId ? response.reply : r)
        }
      });

      setReplyingTo(null);
      toast.success('Reply added successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add reply');
    }
  };

  return (
    <div className="mt-3 p-3">
      <Form onSubmit={handleSubmitComment}>
        <Form.Group controlId="comment" className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            maxLength={500}
            disabled={isCreating}
          />
          <Form.Text className="text-muted">
            {commentText.length}/500 characters
          </Form.Text>
        </Form.Group>
        <div className="d-flex justify-content-end gap-2">
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={isCreating}
          >
            Close
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!commentText.trim() || isCreating}
          >
            {isCreating ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </Form>

      <ListGroup variant="flush" className="mt-3">
        {comments.length ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              onEdit={handleEditComment}
              onDelete={(id) => {
                setCommentToDelete(id);
                setShowDeleteConfirm(true);
              }}
              onReply={setReplyingTo}
              isReplying={replyingTo === comment._id}
              onAddReply={handleAddReply}
              isEditing={editingComment === comment._id}
            />
          ))
        ) : (
          <ListGroup.Item>
            <p className="text-muted text-center">No comments yet</p>
          </ListGroup.Item>
        )}
      </ListGroup>

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDeleteComment(commentToDelete)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CommentSection;