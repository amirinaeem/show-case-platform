import { useSelector } from 'react-redux';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../helpers/Rating';
import AppFooterLayout from '../application/appFooter/AppFooterLayout';
import { useGetApplicationDetailsQuery } from '../../slices/applicationsSlice';

function Application({ application: initialApplication }) {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: fetchedApplication, isError } = useGetApplicationDetailsQuery(initialApplication._id);
  const currentApplication = fetchedApplication || initialApplication;

  const applicationData = {
    ...currentApplication,
    comments: currentApplication.comments || [],
    metrics: {
      likes: currentApplication.likes?.length || 0,
      shares: currentApplication.shares || 0,
      ...currentApplication.metrics
    }
  };

  if (isError) return <div>Error loading application details</div>;

  return (
    <Card className="mb-3 shadow-sm">
      <Row className="g-0 align-items-stretch">
        <Col md={7} className="p-2 d-flex">
          <Link
            to={`/application/${applicationData._id}`}
            className="p-2 w-100 h-100 d-flex"
            aria-label={`View ${applicationData.name} details`}
          >
            <Card.Img
              variant="top"
              src={applicationData.image}
              alt={applicationData.name}
              className="object-fit-cover"
              style={{ maxHeight: '90%', width: '90%', objectFit: 'cover' }}
              loading="lazy"
            />
          </Link>
        </Col>

        <Col md={5} className="p-4 d-flex flex-column">
          <Link
            className="app-title text-decoration-none"
            to={`/application/${applicationData._id}`}
          >
            <Card.Title as="h6" className="mb-1 fw-bold">
              {applicationData.name}
            </Card.Title>
          </Link>

          <Card.Text className="text-muted small mb-2">
            {applicationData.description}
          </Card.Text>

          <div className="d-flex flex-column justify-content-between mb-2">
            <div className="text-center mb-1">
              <Badge bg="success" className="fs-6 px-2 py-1">
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

          <div className="mb-2 text-center">
            {applicationData.tags?.map((tag) => (
              <Badge
                key={tag}
                bg="secondary"
                className="me-1 px-2 py-1 small"
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
                className="w-100 mt-2"
                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
              >
                Live Preview
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Card.Footer className="bg-transparent border-top">
        <AppFooterLayout
          appId={applicationData._id}
          comments={applicationData.comments}
          likes={applicationData.likes || []}
          metrics={applicationData.metrics || {}}
          userInfo={userInfo}
        />
      </Card.Footer>
    </Card>
  );
}

export default Application;
