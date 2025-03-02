import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Application({ application }) {
  return (
    <Card
      className="mb-4 shadow-sm"
      style={{
        height: "auto",
        border: "none",
        borderBottom: "1px solid #dee2e6",
        padding: "1rem",
      }}
    >
      <Row className="h-100 g-0">
        <Col md={7} className="h-100 p-0 overflow-hidden">
          <Link to={`/application/${application._id}`}>
            <Card.Img
              variant="top"
              src={application.image}
              alt={application.name}
              style={{ objectFit: "cover", width: "98%", height: "260px", borderRadius: "0px" }}
            />
          </Link>
        </Col>

        <Col md={5} className="p-2 h-100 d-flex flex-column justify-content-between">
          <Link className='app-title' to={`/application/${application._id}`}>
            <Card.Title as="h6" className="mb-1.5" style={{ fontWeight: "bold" }}>
              {application.name}
            </Card.Title>
          </Link>
          <Card.Text
            className="text-muted small mb-1">
            {application.description}
          </Card.Text>
          <div className="d-flex flex-column justify-content-between align-items-center mb-1">
            <Badge bg="success" className="fs-6">
              ${application.price}
            </Badge>
            <Card.Text as="div">
              <Rating value={application.rating} text={`${application.numReviews} reviews`} />
            </Card.Text>
          </div>
          <div className="mb-1" style={{ textAlign: "center" }}>
            {application.tags.map((tag) => (
              <Badge key={tag} bg="secondary" className="me-1" style={{ padding: "8px" }}>
                {tag}
              </Badge>
            ))}
          </div>

          {application.githubRepo && (
            <div className="d-flex justify-content-center">
              <Button
                variant="outline-primary"
                size="sm"
                href={application.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-50"
                style={{
                  borderRadius: "10px",
                  fontWeight: "bold",
                  borderWidth: "1px",
                  margin: "5px",
                }}
              >
                Live Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-50"
                style={{
                  borderRadius: "10px",
                  fontWeight: "bold",
                  borderWidth: "2px",
                  margin: "5px",
                }}
              >
                Buy Now
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
}

export default Application;