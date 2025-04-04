import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAddCommentMutation } from '../../slices/commentsApiSlice';

const CommentForm = ({ appId, currentUser, onCommentAdded }) => {
  const [text, setText] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const result = await addComment({
        appId,
        text: text.trim(),
      }).unwrap();

      // Notify parent component that a new comment was added
      onCommentAdded(result.comment);
      setText(''); // Clear input
      toast.success('Comment posted!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to post comment');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group controlId="commentText">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write your comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>
      <Button 
        variant="primary" 
        type="submit" 
        disabled={!text.trim() || isLoading}
        className="mt-2"
      >
        {isLoading ? 'Posting...' : 'Post Comment'}
      </Button>
    </Form>
  );
};

export default CommentForm;