import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import { useReplyToCommentMutation } from '../../../slices/applicationsSlice';

const ReplyForm = ({ 
  appId, 
  commentId, 
  onSuccess, 
  onCancel  // Changed from onReplyToComment to onCancel for consistency
}) => {
  const [replyText, setReplyText] = useState('');
  const [addReply, { isLoading }] = useReplyToCommentMutation();
  const { userInfo } = useSelector(state => state.auth);
  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    if (!userInfo) {
      toast.error('Please login to post a reply');
      return;
    }

    try {
      toastId.current = toast.loading('Posting your reply...');
      await addReply({ 
        appId, 
        commentId, 
        reply: replyText,
        userId: userInfo._id 
      }).unwrap();
      
      setReplyText('');
      onSuccess?.();
      
      toast.update(toastId.current, {
        render: 'Reply posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      toast.update(toastId.current, {
        render: error.data?.message || 'Failed to post reply',
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
            aria-label="Reply text input"
          />
        </Form.Group>
        
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onCancel}  // Fixed to use onCancel prop
            disabled={isLoading}
            aria-label="Cancel reply"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={isLoading || !replyText.trim()}
            aria-label="Submit reply"
          >
            {isLoading ? 'Posting...' : 'Post Reply'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ReplyForm;