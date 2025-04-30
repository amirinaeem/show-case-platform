import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useEditCommentMutation } from '../../../slices/applicationsSlice';

const EditComment = ({ appId, commentId, currentText, onCancel }) => {

  const [editComment] = useEditCommentMutation();
  const [text, setText] = useState(currentText);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!text.trim() || text === currentText) return;

    setIsSubmitting(true);
    
    try {
      await editComment({ appId, commentId, newText: text }).unwrap();
      toast.success('Comment updated successfully');
      onCancel();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-2">
      <Form.Group controlId="editCommentText">
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

export default EditComment;