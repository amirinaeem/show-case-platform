import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../helpers/Rating';
import CommentSection from '../comment/commentComponents/CommentLayout';
import ApplicationActions from './ApplicationsActions';

function Application({ application: initialApplication }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [currentApplication, setCurrentApplication] = useState({
    ...initialApplication,
    metrics: {
      likes: initialApplication.likes?.length || 0,
      commentsCount: initialApplication.comments?.length || 0,
      repliesCount: initialApplication.comments?.reduce((acc, comment) => 
        acc + (comment.replies?.length || 0), 0) || 0,
      shares: initialApplication.shares || 0,
      ...initialApplication.metrics
    }
  });

  const calculateTotalComments = () => {
    return currentApplication.comments?.length || 0;
  };

  const calculateTotalReplies = () => {
    return currentApplication.comments?.reduce(
      (sum, comment) => sum + (comment.replies?.length || 0), 
      0
    ) || 0;
  };

  const handleLikeSuccess = (result) => {
    setCurrentApplication(prev => ({
      ...prev,
      likes: result.likes,
      metrics: {
        ...prev.metrics,
        likes: result.likes.length
      }
    }));
  };

  const handleShareSuccess = (result) => {
    setCurrentApplication(prev => ({
      ...prev,
      shares: result.shares,
      metrics: {
        ...prev.metrics,
        shares: result.shares
      }
    }));
  };

  const toggleCommentSection = () => {
    setShowCommentSection(prev => !prev);
  };

  const handleCommentAction = () => {
    console.log('I will make it later');
  };

  const totalComments = calculateTotalComments() + calculateTotalReplies();

  return (
    <Card className="mb-4 shadow-sm">
      <Row className="g-0 align-items-stretch">
        <Col md={7} className="p-0 d-flex">
          <Link 
            to={`/application/${currentApplication._id}`} 
            className="p-4 w-100 h-100 d-flex"
            aria-label={`View ${currentApplication.name} details`}
          >
            <Card.Img
              variant="top"
              src={currentApplication.image}
              alt={currentApplication.name}
              className="app-image h-100 object-fit-cover w-100"
              loading="lazy"
            />
          </Link>
        </Col>

        <Col md={5} className="p-3 d-flex flex-column">
          <Link 
            className="app-title text-decoration-none" 
            to={`/application/${currentApplication._id}`}
          >
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

      <Card.Footer className="bg-transparent border-top">
        <ApplicationActions
          application={currentApplication}
          userInfo={userInfo}
          showCommentSection={showCommentSection}
          toggleCommentSection={toggleCommentSection}
          totalComments={totalComments}
          onLikeSuccess={handleLikeSuccess}
          onShareSuccess={handleShareSuccess}
        />

        {showCommentSection && (
          <CommentSection 
            appId={currentApplication._id}
            comments={currentApplication.comments || []}
            onClose={() => setShowCommentSection(false)}
            onCommentAction={handleCommentAction}
            currentUser={userInfo}
          />
        )}
      </Card.Footer>
    </Card>
  );
}

export default Application;