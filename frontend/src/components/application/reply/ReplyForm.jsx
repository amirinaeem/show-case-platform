import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button, Form } from 'react-bootstrap';
import { useReplyToCommentMutation } from '../../../slices/applicationsSlice';
import { fetchLinkMetadata } from '../../../utils/metaDataLink';

const ReplyForm = ({ appId, commentId, onCancel }) => {
  const [replyText, setReplyText] = useState('');
  const [replyToComment, { isLoading }] = useReplyToCommentMutation();
  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedText = replyText.trim();
    
    if (!trimmedText ) return;

    toastId.current = toast.loading('Posting your reply...');

    try {
      
      const linkPreview = await fetchLinkMetadata(trimmedText);
      
      await replyToComment({ appId, commentId, reply: trimmedText, linkPreview }).unwrap();

      setReplyText('');
     
      toast.update(toastId.current, {
        render: 'Reply posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });

      onCancel?.();
    } catch (error) {
      toast.update(toastId.current, {
        render: error?.data?.message || 'Failed to post reply',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
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
            onClick={onCancel}
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