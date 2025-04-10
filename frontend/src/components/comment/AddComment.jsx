import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAddCommentMutation } from '../../slices/applicationsSlice';
import { Button, Form } from 'react-bootstrap';

const AddComment = ({ appId, onCommentSuccess }) => {
  const [commentText, setCommentText] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();
  const toastId = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    toastId.current = toast.loading('Posting comment...');

    try {
      const result = await addComment({ 
        appId, 
        comment: commentText 
      }).unwrap();
      
      setCommentText('');
      onCommentSuccess(result);
      toast.update(toastId.current, {
        render: 'Comment posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast.update(toastId.current, {
        render: error.data?.message || 'Failed to post comment',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const handleCancel = () => {
    setCommentText('');
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4">
      <Form.Group controlId="commentTextarea">
        <Form.Control
          as="textarea"
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          disabled={isLoading}
        />
      </Form.Group>
      <div className="d-flex justify-content-end mt-2">
        <Button
          variant="outline-secondary"
          size="sm"
          className="me-2"
          onClick={handleCancel}
          disabled={isLoading}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          type="submit"
          disabled={isLoading || !commentText.trim()}
        >
          {isLoading ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </Form>
  );
};

export default AddComment;