import { useState, useRef } from 'react';
import { useAddCommentMutation } from '../../../slices/applicationsSlice';
import { Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AddCommentForm = ({ appId, onCancel }) => {
  const [commentText, setCommentText] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();
  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isLoading) return;

    toastId.current = toast.loading('Posting comment...');

    try {
       await addComment({ appId, comment: commentText }).unwrap();

      setCommentText('');
      toast.update(toastId.current, {
        render: 'Comment posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

    } catch (error) {
      toast.update(toastId.current, {
        render: error.data?.message || 'Failed to post comment',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="comment-form-container mt-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commentTextarea">
          <Form.Control
            as="textarea"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment or paste a link..."
            disabled={isLoading}
          />
        </Form.Group>

        <div className="d-flex justify-content-end mt-2">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="me-2" 
            onClick={onCancel} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            type="submit" 
            disabled={isLoading || !commentText.trim()}
          >
            {isLoading ? <Spinner size="sm" animation="border" /> : 'Post'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCommentForm;