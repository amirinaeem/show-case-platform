import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDeleteCommentMutation } from '../../../slices/applicationsSlice';

const DeleteComment = ({ commentId, appId }) => {
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();

  const handleDelete = async () => {
    try {
      await deleteComment({ appId, commentId }).unwrap();
    } catch (error) {
      console.error('Deletion failed:', error);
    }
  };

  return (
    <Button
      variant="link"
      size="sm"
      className="text-danger p-0 ms-auto"
      onClick={handleDelete}
      disabled={isLoading}
      title="Delete comment"
    >
      <FontAwesomeIcon icon={faTrash} size="sm" />
    </Button>
  );
};

export default DeleteComment;