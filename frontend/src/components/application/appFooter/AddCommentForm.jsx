import { useState, useRef } from 'react';
import { useAddCommentMutation } from '../../../slices/applicationsSlice';
import { fetchLinkMetadata } from '../../../utils/metaDataLink';
import { Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AddCommentForm = ({ appId, onCancel }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addComment] = useAddCommentMutation();
  const toastId = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedText = commentText.trim();
    
    if (!trimmedText || isSubmitting) return;

    setIsSubmitting(true);
    toastId.current = toast.loading('Posting comment...');

    try {
      // Fetch metadata on client side first for optimistic update
      const linkPreview = await fetchLinkMetadata(trimmedText);

      console.log(linkPreview, 'the frontend preview package can not fetch the data')
      
      await addComment({ 
        appId, 
        comment: trimmedText,
        linkPreview // Pass to optimistic update
      }).unwrap();

      setCommentText('');
      toast.update(toastId.current, {
        render: 'Comment posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId.current, {
        render: error?.data?.message || 'Failed to post comment',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting}
            aria-label="Comment input"
          />
        </Form.Group>

        <div className="d-flex justify-content-end mt-2">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="me-2" 
            onClick={onCancel} 
            disabled={isSubmitting}
            aria-label="Cancel comment"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            type="submit" 
            disabled={isSubmitting || !commentText.trim()}
            aria-label="Submit comment"
          >
            {isSubmitting ? (
              <>
                <Spinner 
                  as="span" 
                  animation="border" 
                  size="sm" 
                  role="status"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Posting...</span>
              </>
            ) : 'Post'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddCommentForm;