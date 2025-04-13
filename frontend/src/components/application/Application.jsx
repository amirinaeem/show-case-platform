import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../helpers/Rating';
import AppFooterHandlers from './AppFooterHandlers';
import CommentsList from '../comment/CommentList';
import { useGetApplicationDetailsQuery } from '../../slices/applicationsSlice';

function Application({ application: initialApplication }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  
  // Use RTK Query to get fresh data
  const { data: fetchedApplication, refetch } = useGetApplicationDetailsQuery(initialApplication._id);
  
  // Maintain local state that syncs with both initial props and RTK Query data
  const [currentApplication, setCurrentApplication] = useState({
    ...initialApplication,
    comments: initialApplication.comments || [],
    metrics: {
      likes: initialApplication.likes?.length || 0,
      shares: initialApplication.shares || 0,
      ...initialApplication.metrics
    }
  });

  // Sync state when new data arrives from RTK Query
  useEffect(() => {
    if (fetchedApplication) {
      setCurrentApplication({
        ...fetchedApplication,
        comments: fetchedApplication.comments || [],
        metrics: {
          likes: fetchedApplication.likes?.length || 0,
          shares: fetchedApplication.shares || 0,
          ...fetchedApplication.metrics
        }
      });
    }
  }, [fetchedApplication]);

  const handleLikeSuccess = (result) => {
    setCurrentApplication(prev => ({
      ...prev,
      likes: result.likes || prev.likes,
      metrics: {
        ...prev.metrics,
        likes: result.likes.length || prev.metrics.likes
      }
    }));
    refetch(); // Ensure we have fresh data
  };

  const handleCommentSuccess = () => {
    refetch(); // Ensure we have fresh data
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

  const toggleComments = () => setShowComments(prev => !prev);

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

      <Card.Footer className="bg-transparent border-top position-relative">
        <AppFooterHandlers
          application={currentApplication}
          userInfo={userInfo}
          onLikeSuccess={handleLikeSuccess}
          onCommentSuccess={handleCommentSuccess}
          onShareSuccess={handleShareSuccess}
          onToggleComments={toggleComments}
          showComments={showComments}
        />
      </Card.Footer>
      
      {showComments && (
        <CommentsList 
          comments={currentApplication.comments || []} 
          appId={currentApplication._id}
          currentUserId={userInfo?._id}
          isAdmin={userInfo?.isAdmin || false}
          onCommentSuccess={handleCommentSuccess}
          onCommentDelete={() => refetch()} 
        />
      )}
    </Card>
  );
}

export default Application;