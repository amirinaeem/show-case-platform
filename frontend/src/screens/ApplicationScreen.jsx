import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Badge } from "react-bootstrap";
import Loader from '../components/Loader';
import Message from "../components/Message";
import Rating from "../components/Rating";
import { useGetApplicationDetailsQuery } from '../slices/applicationsSlice';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';

function ApplicationScreen() {
  const { id: appId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: application, isLoading, isError } = useGetApplicationDetailsQuery(appId);

  // Add to Cart Handler
  const addToCartHandler = () => {
    if (application.isAvailable) {
      dispatch(
        addToCart({
          _id: application._id,
          name: application.name,
          image: application.image,
          price: application.price,
          licenseType: application.licenseType,
          qty: 1, // Fixed quantity for digital products
        })
      );
      navigate('/cart'); // Redirect to the cart page
    } else {
      alert("This application is not available for purchase.");
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant='danger'>{isError?.data?.message || isError.error}</Message>
      ) : (
        <div>
       <Row className="d-flex align-items-stretch"> {/* Add align-items-stretch */}
       <Col md={6}>
    <Card className="h-100"> {/* Add h-100 to make the Card fill the height */}
      <Image
        style={{
          height: '100%',
          objectFit: 'cover',
          borderRadius: '10px',
        }}
        src={application.image}
        alt={application.name}
        fluid
      />
    </Card>
  </Col>

  <Col md={3}>
    <Card className="h-100"> {/* Add h-100 to make the Card fill the height */}
      <ListGroup variant="flush">
        <ListGroup.Item>
          <h5>Author Details</h5>
          <p>
            <strong>Name:</strong> {application.authorDetails?.name || "N/A"}
          </p>
          <p>
            <strong>Portfolio:</strong>{" "}
            <a
              href={application.authorDetails?.portfolioLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Portfolio
            </a>
          </p>
          <p>
            <strong>Last Update:</strong> {application.authorDetails?.lastUpdate || "N/A"}
          </p>
          <p>
            <strong>Published:</strong> {application.authorDetails?.published || "N/A"}
          </p>
          <p>
            <strong>High Resolution:</strong>{" "}
            {application.authorDetails?.highResolution ? "Yes" : "No"}
          </p>
          <p>
            <strong>Compatible Browsers:</strong>{" "}
            {application.authorDetails?.compatibleBrowsers?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Compatible With:</strong> {application.authorDetails?.compatibleWith || "N/A"}
          </p>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  </Col>

  <Col md={3}>
    <Card className="h-100"> {/* Add h-100 to make the Card fill the height */}
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Row>
            <Col>Price:</Col>
            <Col>
              <strong>${application.price || "N/A"}</strong>
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col>License:</Col>
            <Col md={6}>
              <strong>{application.licenseType || "N/A"}</strong>
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col>Support:</Col>
            <Col>
              <strong>{application.supportDetails?.duration || "N/A"}</strong>
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col>Quantity:</Col>
            <Col>
              <strong>1</strong> {/* Fixed quantity for digital products */}
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Row>
            <Col>Status:</Col>
            <Col>
              {application.isAvailable ? (
                <Badge bg="success">Available</Badge>
              ) : (
                <Badge bg="danger">Not Available</Badge>
              )}
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item>
          <Button
            className="btn-block"
            type="button"
            disabled={!application.isAvailable} // Disable button if not available
            onClick={addToCartHandler}
            style={{ cursor: application.isAvailable ? 'pointer' : 'not-allowed' }} // Change cursor based on availability
          >
            Add to Cart
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  </Col>
</Row>

          <Row className="d-flex my-3">
            <ListGroup.Item>
              <div className="d-grid gap-4" style={{ margin: '4rem' }}>
                <Button
                  variant="outline-primary"
                  href={application.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </Button>
                <Button
                  variant="outline-secondary"
                  href={application.documentationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </Button>
                <Button
                  variant="outline-success"
                  href={application.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repo
                </Button>
              </div>
            </ListGroup.Item>
          </Row>

          <Row>
            <Col md={12}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{application.name || "N/A"}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={application.rating}
                    text={`${application.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item style={{ fontSize: '1.3rem', lineHeight: '2rem' }}>
                  <strong>Description:</strong> {application.description || "N/A"}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          <Row>
            <div className="mt-3">
              <h5>Previews</h5>
              <Row>
                {application.previews?.map((preview, index) => (
                  <Col key={index} md={12} className="mb-3">
                    <video controls style={{ width: "100%" }}>
                      <source src={preview.url} type="video/mp4" />
                    </video>
                    <p className="text-muted small mt-1">{preview.caption}</p>
                  </Col>
                ))}
              </Row>
            </div>
          </Row>

          <Row>
            <Col>
              <ListGroup.Item>
                <strong>Features:</strong>
                <ul>
                  {application.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </ListGroup.Item>
            </Col>
            <Col>
              <ListGroup.Item>
                <strong>Stack</strong>
                <ul>
                  <li>{application.platform || "N/A"}</li>
                  <li>{application.framework || "N/A"}</li>
                  <li>{application.database || "N/A"}</li>
                </ul>
              </ListGroup.Item>
            </Col>
            <Col>
              <ListGroup.Item>
                <strong>Tags:</strong>
                <div>
                  {application.tags?.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </ListGroup.Item>
            </Col>
          </Row>

          <hr></hr>

          <Row className="mt-4">
            <Col md={8}>
              <h4>Reviews</h4>
              {application.reviews?.length === 0 && <p>No reviews yet.</p>}
              <ListGroup variant="flush">
                {application.reviews?.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.user?.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.comment}</p>
                    <p className="text-muted small">
                      Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default ApplicationScreen;