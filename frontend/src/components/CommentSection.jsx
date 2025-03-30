import { useState, useCallback } from 'react';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { 
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useAddReplyMutation,
  useLikeCommentMutation,
  useEditReplyMutation,
  useDeleteReplyMutation
} from '../slices/applicationsSlice';
import CommentItem from './CommentItem';
import { 
  createOptimisticComment,
  createOptimisticReply
} from '../utils/optimisticUpdates';

const CommentSection = ({ 
  appId, 
  comments = [], 
  onClose, 
  onCommentAction, 
  currentUser 
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);

  // API mutations
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [editComment] = useEditCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const [addReply] = useAddReplyMutation();
  const [likeComment] = useLikeCommentMutation();
  const [editReply] = useEditReplyMutation();
  const [deleteReply] = useDeleteReplyMutation();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;
  
    const optimisticComment = createOptimisticComment(currentUser, trimmedComment);
    
    try {
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
        commentId: optimisticComment._id,
        updates: response.comment
      });

      setCommentText('');
      toast.success('Comment added successfully');
    } catch (error) {
      onCommentAction({
        type: 'DELETE_COMMENT',
        commentId: optimisticComment._id
      });
      toast.error(error?.data?.message || 'Failed to add comment');
    }
  };

  const handleEditSubmit = useCallback(async (commentId, newText) => {
    const trimmedText = newText.trim();
    if (!trimmedText) return;
  
    try {
      await editComment({ 
        appId, 
        commentId, 
        newText: trimmedText 
      }).unwrap();
  
      setEditingCommentId(null);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update comment');
    }
  }, [appId, editComment]);

  const handleDeleteComment = useCallback(async () => {
    if (!commentToDeleteId) return;
    
    try {
      onCommentAction({
        type: 'DELETE_COMMENT',
        commentId: commentToDeleteId
      });

      await deleteComment({ 
        appId, 
        commentId: commentToDeleteId 
      }).unwrap();
      
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete comment');
    } finally {
      setShowDeleteConfirm(false);
      setCommentToDeleteId(null);
    }
  }, [appId, commentToDeleteId, deleteComment, onCommentAction]);

  const handleAddReply = useCallback(async (commentId, replyText) => {
    const trimmedReply = replyText.trim();
    if (!trimmedReply) return;
  
    const optimisticReply = createOptimisticReply(currentUser, trimmedReply);
  
    try {
      onCommentAction({
        type: 'ADD_REPLY',
        commentId,
        reply: optimisticReply
      });
  
      const response = await addReply({
        appId,
        commentId,
        reply: trimmedReply
      }).unwrap();
  
      onCommentAction({
        type: 'UPDATE_REPLY',
        commentId,
        tempId: optimisticReply._id,
        updates: {
          ...response.reply,
          isOptimistic: false
        }
      });
  
      setReplyingToId(null);
      toast.success('Reply added successfully');
    } catch (error) {
      onCommentAction({
        type: 'DELETE_REPLY',
        commentId,
        replyId: optimisticReply._id
      });
      toast.error(error?.data?.message || 'Failed to add reply');
    }
  }, [appId, addReply, currentUser, onCommentAction]);

  const handleEditReply = useCallback(async (commentId, replyId, newText) => {
    const trimmedText = newText.trim();
    if (!trimmedText) return;

    try {
      onCommentAction({
        type: 'UPDATE_REPLY',
        commentId,
        replyId,
        updates: {
          reply: trimmedText,
          isEdited: true,
          editedAt: new Date().toISOString(),
          isOptimistic: true
        }
      });

      const response = await editReply({
        appId,
        commentId,
        replyId,
        newText: trimmedText
      }).unwrap();

      onCommentAction({
        type: 'UPDATE_REPLY',
        commentId,
        replyId,
        updates: response.reply
      });

      toast.success('Reply updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update reply');
    }
  }, [appId, editReply, onCommentAction]);

  const handleDeleteReply = useCallback(async (commentId, replyId) => {
    try {
      onCommentAction({
        type: 'DELETE_REPLY',
        commentId,
        replyId
      });

      await deleteReply({
        appId,
        commentId,
        replyId
      }).unwrap();

      toast.success('Reply deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete reply');
    }
  }, [appId, deleteReply, onCommentAction]);

  const handleLikeComment = useCallback(async (commentId) => {
    try {
      const comment = comments.find(c => c._id === commentId);
      const isLiked = comment?.likes?.includes(currentUser._id);
      
      onCommentAction({
        type: 'TOGGLE_LIKE',
        commentId,
        userId: currentUser._id,
        isLiked: !isLiked
      });

      await likeComment({
        appId,
        commentId
      }).unwrap();
    } catch (error) {
      const comment = comments.find(c => c._id === commentId);
      const isLiked = comment?.likes?.includes(currentUser._id);
      
      onCommentAction({
        type: 'TOGGLE_LIKE',
        commentId,
        userId: currentUser._id,
        isLiked: !isLiked
      });

      toast.error(error?.data?.message || 'Failed to update like');
    }
  }, [appId, comments, currentUser, likeComment, onCommentAction]);

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
            aria-label="Comment text area"
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
            aria-label="Close comment section"
          >
            Close
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!commentText.trim() || isCreating}
            aria-label="Post comment"
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
              onEdit={handleEditSubmit}
              onEditToggle={setEditingCommentId}
              onDelete={(id) => {
                setCommentToDeleteId(id);
                setShowDeleteConfirm(true);
              }}
              onReply={setReplyingToId}
              isReplying={replyingToId === comment._id}
              onAddReply={handleAddReply}
              isEditing={editingCommentId === comment._id}
              onLike={handleLikeComment}
              onEditReply={handleEditReply}
              onDeleteReply={handleDeleteReply}
              setEditingCommentId={setEditingCommentId}
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
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteConfirm(false)}
            aria-label="Cancel delete"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteComment}
            disabled={isDeleting}
            aria-label="Confirm delete"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommentSection;