import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../helpers/Rating';
import AppFooterLayout from '../application/appFooter/AppFooterLayout';
import { useGetApplicationDetailsQuery } from '../../slices/applicationsSlice';


function Application({ application: initialApplication }) {

  const { userInfo } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  
  
  // RTK Query for data fetching
  const { data: fetchedApplication, isError } = 
    useGetApplicationDetailsQuery(initialApplication._id);

  // Determine which application data to use
  const currentApplication = fetchedApplication || initialApplication;

  // Ensure comments and metrics exist
  const applicationData = {
    ...currentApplication,
    comments: currentApplication.comments || [],
    metrics: {
      likes: currentApplication.likes?.length || 0,
      shares: currentApplication.shares || 0,
      ...currentApplication.metrics
    }
  };


   
  const toggleComments = () => setShowComments(prev => !prev);

  
  if (isError) return <div>Error loading application details</div>;

  return (
    <Card className="mb-4 shadow-sm">

      <Row className="g-0 align-items-stretch">
        <Col md={7} className="p-0 d-flex">
          <Link 
            to={`/application/${applicationData._id}`} 
            className="p-4 w-100 h-100 d-flex"
            aria-label={`View ${applicationData.name} details`}
          >
            <Card.Img
              variant="top"
              src={applicationData.image}
              alt={applicationData.name}
              className="app-image h-100 object-fit-cover w-100"
              loading="lazy"
            />
          </Link>
        </Col>

        <Col md={5} className="p-3 d-flex flex-column">
          <Link 
            className="app-title text-decoration-none" 
            to={`/application/${applicationData._id}`}
          >
            <Card.Title as="h5" className="mb-2 fw-bold">
              {applicationData.name}
            </Card.Title>
          </Link>
          
          <Card.Text className="text-muted small mb-3">
            {applicationData.description}
          </Card.Text>

          
          
          <div className="d-flex flex-column justify-content-between mb-3">
            <div className="text-center mb-2">
              <Badge bg="success" className="fs-5 px-3 py-2">
                ${applicationData.price}
              </Badge>
            </div>
            
            <Card.Text as="div" className="text-center">
              <Rating 
                value={applicationData.rating} 
                text={`${applicationData.numReviews} reviews`} 
              />
            </Card.Text>
          </div>
          
          <div className="mb-3 text-center">
            {applicationData.tags?.map((tag) => (
              <Badge 
                key={tag} 
                bg="secondary" 
                className="me-1 px-2 py-2"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {applicationData.githubRepo && (
            <div className="d-flex justify-content-center mt-auto">
              <Button
                variant="outline-primary"
                size="sm"
                href={applicationData.githubRepo}
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
        <AppFooterLayout
          appId={applicationData._id}
          comments={applicationData.comments}
          likes={applicationData.likes || []}
          metrics={applicationData.metrics || {}}
          userInfo={userInfo}
          onToggleComments={toggleComments}
          showComments={showComments}
        />
        
      </Card.Footer>
    </Card>
  );
}

export default Application;