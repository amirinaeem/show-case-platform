// components/ShareButton.js
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useShareApplicationMutation } from '../../../slices/applicationsSlice';

const ShareButton = ({ application, onShareSuccess }) => {
  const [shareApplication] = useShareApplicationMutation();

  const handleShare = async () => {
    try {
      const result = await shareApplication(application._id).unwrap();
      onShareSuccess(result);
      toast.success(result.message || 'Application shared successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to share application');
    }
  };

  return (
    <Button 
      variant="outline-success" 
      onClick={handleShare}
      className="action-btn"
      aria-label="Share this application"
    >
      <i className="fas fa-share me-2"></i> 
      Share ({application.metrics?.shares || application.shares || 0})
    </Button>
  );
};

export default ShareButton;