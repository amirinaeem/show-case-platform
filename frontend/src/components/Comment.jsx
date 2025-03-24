import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAddCommentMutation } from '../slices/applicationsSlice';

const Comment = ({ application, userInfo, onClose, onCommentAdded }) => {
  const [addComment] = useAddCommentMutation();
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error('Please enter a comment before posting');
      return;
    }
    
    try {
      const result = await addComment({ 
        appId: application._id, 
        text: commentText 
      }).unwrap();
      
      onCommentAdded(result.comment);
      setCommentText('');
      toast.success('Comment posted successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to post comment');
    }
  };

  // Helper function to get display name
  const getDisplayName = (comment) => {
    // If user is populated as an object with name
    if (comment.user && typeof comment.user === 'object' && comment.user.name) {
      return comment.user._id === userInfo?._id ? 'You' : comment.user.name;
    }
    // If user is just an ID reference and matches current user
    if (comment.user === userInfo?._id) {
      return 'You';
    }
    // If we can't determine the name
    return 'Anonymous';
  };

  return (
    <div className="mt-3">
      <Form onSubmit={handleSubmit}>
        {userInfo && (
          <div className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
              className="mb-2"
            />
            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="outline-secondary" 
                size="sm"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                type="submit"
                disabled={!commentText.trim()}
              >
                Post Comment
              </Button>
            </div>
          </div>
        )}
      </Form>

      {/* Comments List with proper user association */}
      <div className="comment-list">
        {application.comments?.map((comment) => (
          <div key={comment._id} className="comment-item mb-2 p-2 bg-light rounded">
            <div className="d-flex justify-content-between">
              <strong>{getDisplayName(comment)}</strong>
              <small className="text-muted">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
            <p className="mb-0 mt-1">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;