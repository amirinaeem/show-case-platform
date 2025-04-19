import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDeleteCommentMutation } from '../../slices/applicationsSlice';

const DeleteComment = ({ commentId, onDeleteComment, appId, userId, commentUserId, isAdmin = false }) => {
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();


  if (userId !== commentUserId && !isAdmin) {
    return null;
  }

  const handleDelete = async () => {
    
    if (!appId || !commentId) {
      console.error('Missing required IDs for deletion');
      return;
    }

    try {
      const deletedComment = await deleteComment({ appId, commentId }).unwrap();
      onDeleteComment(deletedComment);
    } catch (error) {
      console.error('Deletion failed:', {
        status: error.status,
        data: error.data,
        originalError: error
      });
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