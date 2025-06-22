import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDeleteReplyMutation } from '../../../slices/applicationsSlice';

const DeleteReply = ({ appId, commentId, replyId }) => {

  const [deleteReply, { isLoading }] = useDeleteReplyMutation();

  const handleDelete = async () => {
    try {
      await deleteReply({ appId, commentId, replyId }).unwrap();
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
      title="Delete Reply"
    >
      <FontAwesomeIcon icon={faTrash} size="sm" />
    </Button>
  );
    
};

export default DeleteReply;