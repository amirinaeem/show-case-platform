import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useReplyToCommentMutation } from '../../slices/applicationsSlice';
import { Button, Form } from 'react-bootstrap';

const ReplyToComment = ({ appId, onReplyToComment, commentId, commentUserId,  }) => {
  const [replyText, setReplyText] = useState('');
  const [replyToComment, { isLoading }] = useReplyToCommentMutation();
  const { userInfo } = useSelector(state => state.auth);
  const toastId = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    if (isLoading) return;

    try {
      toastId.current = toast.loading('Posting your reply...');
      
      const repliedComment = await replyToComment({ 
        appId,
        commentId, 
        commentUserId,
        reply: replyText,
        userId: userInfo._id
      }).unwrap();

      setReplyText('');
      onReplyToComment?.(repliedComment);
      
      toast.update(toastId.current, {
        render: 'Reply posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error('Failed to post reply:', error);
      toast.update(toastId.current, {
        render: error.data?.message || 'Failed to post reply. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  return (
    <div className="mt-2">
      <Form onSubmit={handleSubmit} className="mt-2">
        <Form.Group controlId="replyTextarea" className="mb-2">
          <Form.Control
            as="textarea"
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            disabled={isLoading}
            style={{ minHeight: '100px' }}
          />
        </Form.Group>
        
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onReplyToComment?.()} // This will trigger the parent to close the form
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isLoading || !replyText.trim()}
          >
            {isLoading ? 'Posting...' : 'Post Reply'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default React.memo(ReplyToComment);