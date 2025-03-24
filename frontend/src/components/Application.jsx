import { useSelector } from 'react-redux';
import { useState, useCallback } from 'react'; // Added useCallback import
import { toast } from 'react-toastify';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { useLikeApplicationMutation, useShareApplicationMutation } from '../slices/applicationsSlice';
import Comment from './Comment';

function Application({ application: initialApplication }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [likeApplication] = useLikeApplicationMutation();
  const [shareApplication] = useShareApplicationMutation();
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(initialApplication);

  const handleLike = async () => {
    try {
      const result = await likeApplication(currentApplication._id).unwrap();
      setCurrentApplication(prev => ({
        ...prev,
        likes: result.likes,
        metrics: {
          ...prev.metrics,
          likes: result.likes.length
        }
      }));
      toast.success('Application liked successfully');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareApplication(currentApplication._id).unwrap();
      setCurrentApplication(prev => ({
        ...prev,
        shares: result.shares,
        metrics: {
          ...prev.metrics,
          shares: result.shares
        }
      }));
      toast.success('Application shared successfully');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleCommentAdded = useCallback((newComment) => {
    setCurrentApplication(prev => {
      // Check if comment already exists
      if (prev.comments?.some(c => c._id === newComment._id)) return prev;
      
      return {
        ...prev,
        comments: [newComment, ...(prev.comments || [])],
      };
    });
  }, []);

  return (
    <Card className="mb-4 shadow-sm">
      <Row className="g-0 align-items-stretch">
        {/* Application Image */}
        <Col md={7} className="p-0 d-flex">
          <Link 
            to={`/application/${currentApplication._id}`} 
            className="p-4 w-100 h-100 d-flex"
          >
            <Card.Img
              variant="top"
              src={currentApplication.image}
              alt={currentApplication.name}
              className="app-image h-100 object-fit-cover w-100"
            />
          </Link>
        </Col>

        {/* Application Details */}
        <Col md={5} className="p-3 d-flex flex-column">
          <Link className="app-title" to={`/application/${currentApplication._id}`}>
            <Card.Title as="h5" className="mb-2 fw-bold">
              {currentApplication.name}
            </Card.Title>
          </Link>
          
          <Card.Text className="text-muted small mb-3">
            {currentApplication.description}
          </Card.Text>
          
          <div className="d-flex flex-column justify-content-between mb-3">
            <div className="text-center mb-2">
              <Badge bg="success" className="fs-5 px-3 py-2">
                ${currentApplication.price}
              </Badge>
            </div>
            
            <Card.Text as="div" className="text-center">
              <Rating 
                value={currentApplication.rating} 
                text={`${currentApplication.numReviews} reviews`} 
              />
            </Card.Text>
          </div>
          
          <div className="mb-3 text-center">
            {currentApplication.tags?.map((tag) => (
              <Badge 
                key={tag} 
                bg="secondary" 
                className="me-1 px-2 py-2"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {currentApplication.githubRepo && (
            <div className="d-flex justify-content-center mt-auto">
              <Button
                variant="outline-primary"
                size="sm"
                href={currentApplication.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-75 live-preview-btn"
              >
                Live Preview
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Action Buttons */}
      <Card.Footer className="bg-transparent border-top">
        <div className="d-flex justify-content-between p-4">
          <Button 
            variant="outline-primary" 
            onClick={handleLike}
            className="action-btn"
          >
            <i className="fas fa-thumbs-up me-2"></i> 
            Like ({currentApplication.likes?.length || 0})
          </Button>
          
          <Button 
            variant={showCommentSection ? "outline-secondary" : "outline-primary"}
            onClick={() => setShowCommentSection(!showCommentSection)}
            className="action-btn"
          >
            <i className="fas fa-comment me-2"></i> 
            Comment ({currentApplication.comments?.length || 0})
          </Button>
          
          <Button 
            variant="outline-success" 
            onClick={handleShare}
            className="action-btn"
          >
            <i className="fas fa-share me-2"></i> 
            Share ({currentApplication.shares || 0})
          </Button>
        </div>

        {/* Comment Section */}
        {showCommentSection && (
          <Comment 
            application={currentApplication} 
            userInfo={userInfo}
            onClose={() => setShowCommentSection(false)}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </Card.Footer>
    </Card>
  );
}

export default Application;