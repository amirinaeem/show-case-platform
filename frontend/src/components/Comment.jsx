import { useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { 
  useCreateCommentMutation,
  useGetApplicationDetailsQuery 
} from '../slices/applicationsSlice';
import Loader from './Loader';
import Message from './Message';

function Comment({ appId, onClose, onCommentAdded, currentUser }) {
  const [commentText, setCommentText] = useState('');
  const [optimisticId, setOptimisticId] = useState(null);
  
  const { data: application, isLoading, error, refetch } = 
    useGetApplicationDetailsQuery(appId);
  
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;
    
    try {
      // 1. Create temporary ID for optimistic update
      const tempId = `optimistic-${Date.now()}`;
      setOptimisticId(tempId);
      
      // 2. Create optimistic comment
      const optimisticComment = {
        _id: tempId,
        user: currentUser._id,
        name: currentUser.name,
        comment: trimmedComment,
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };
      
      // 3. Immediately add to UI
      onCommentAdded(optimisticComment);
      setCommentText('');
      
      // 4. Submit to backend
      const response = await createComment({
        appId,
        comment: trimmedComment
      }).unwrap();
      
      // 5. Replace with real comment
      onCommentAdded({
        _id: tempId,
        replaceWith: response.comment
      });
      
      toast.success('Comment added successfully');
      refetch();
    } catch (err) {
      // 6. Remove optimistic comment on error
      if (optimisticId) {
        onCommentAdded({ _id: optimisticId, remove: true });
      }
      toast.error(err?.data?.message || err.message || 'Failed to add comment');
    } finally {
      setOptimisticId(null);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  return (
    <div className="mt-3 p-3">
      <Form onSubmit={submitHandler}>
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
        {application?.comments?.length ? (
          application.comments.map((comment) => (
            <ListGroup.Item 
              key={comment._id}
              className={comment.isOptimistic ? 'opacity-75' : ''}
            >
              <div className="d-flex justify-content-between">
                <strong>{comment.name}</strong>
                <small className="text-muted">
                  {new Date(comment.createdAt).toLocaleDateString()}
                  {comment.isOptimistic && ' (Posting...)'}
                </small>
              </div>
              <p className="mt-2 mb-0">{comment.comment}</p>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>
            <p className="text-muted text-center">No comments yet</p>
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
}

export default Comment;