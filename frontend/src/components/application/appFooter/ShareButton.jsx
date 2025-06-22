import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useShareApplicationMutation } from '../../../slices/applicationsSlice';

const ShareButton = ({ appId }) => {
  const [shareApplication] = useShareApplicationMutation();

  const handleShare = async () => {
    try {
      await shareApplication(appId).unwrap();
      toast.success('Application shared successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to share application');
    }
  };

  return (
    <Button 
      variant="outline-primary" 
      onClick={handleShare}
      className="pax-3 py-2 px-4"
      aria-label="Share this application"
     
    >
      <i className="fas fa-share-alt me-2"></i> Share
    </Button>
  );
};

export default ShareButton;