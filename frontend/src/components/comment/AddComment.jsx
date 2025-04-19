import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useAddCommentMutation } from '../../slices/applicationsSlice';
import { Button, Form } from 'react-bootstrap';

const AddComment = ({ appId, onAddComment }) => {
  const [commentText, setCommentText] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();
  const { userInfo } = useSelector(state => state.auth);
  const toastId = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isLoading) return;
  
    toastId.current = toast.loading('Posting comment...');
  
    try {
      const newComment = await addComment({ 
        appId, 
        comment: commentText,
        userId: userInfo._id
      }).unwrap();
      
      setCommentText('');
      onAddComment(newComment);

      toast.update(toastId.current, {
        render: 'Comment posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      
    } catch (error) {
      toast.update(toastId.current, {
        render: error.data?.message || 'Failed to post comment',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
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
          onClick={() => setCommentText('')}
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

export default React.memo(AddComment);