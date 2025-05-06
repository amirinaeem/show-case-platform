import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useEditReplyMutation } from '../../../slices/applicationsSlice';
import { fetchLinkMetadata } from '../../../utils/metaDataLink';

const EditReply = ({ appId, commentId, replyId, currentText, onCancel, }) => {
  const [editReply] = useEditReplyMutation();
  const [text, setText] = useState(currentText);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedText = text.trim();
    
    if (!trimmedText || isSubmitting) return;

    setIsSubmitting(true);

    try {

      const linkPreview = await fetchLinkMetadata(trimmedText);

      await editReply({ appId, commentId, replyId, newText: trimmedText, linkPreview }).unwrap();
      toast.success('Reply updated successfully');
      onCancel();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-2">
      <Form.Group controlId="editReplyText">
        <Form.Control
          as="textarea"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
      </Form.Group>
      <div className="d-flex justify-content-end mt-2">
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          className="me-2"
          disabled={isSubmitting}
          size="sm"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || !text.trim() || text === currentText}
          size="sm"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Form>
  );
};

export default EditReply;