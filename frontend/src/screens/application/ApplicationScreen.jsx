import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Row, Col, Image, ListGroup, Card, Button, Badge, Form } from "react-bootstrap";
import Loader from "../../components/helpers/Loader";
import Message from "../../components/helpers/Message";
import Rating from "../../components/helpers/Rating";
import { useGetApplicationDetailsQuery, useCreateReviewMutation } from "../../slices/applicationsSlice";
import { addToCart } from "../../slices/cartSlice";

function ApplicationScreen() {
  
  const { id: appId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: application, refetch, isLoading, isError } = useGetApplicationDetailsQuery(appId);
  const [createReview, { isLoading: loadingApplicationReview }] = useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  console.log(application.image, 'from application screen')

  // Add to Cart Handler
  const addToCartHandler = () => {
    if (application.isAvailable) {
      dispatch(
        addToCart({
          ...application,
          qty: 1,
        })
      );
      navigate("/cart"); // Redirect to the cart page
    } else {
      toast.error("This application is not available for purchase.");
    }
  };

  // Submit Review Handler
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        appId,
        rating,
        comment,
      }).unwrap();
      refetch();
      console.log(refetch())
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
        <Message variant="danger">{isError?.data?.message || isError.error}</Message>
      ) : (
        <div>
          {/* Application Details */}
          <Row className="d-flex align-items-stretch">
            {/* Application Image */}
            <Col md={6}>
              <Card className="h-100">
                <Image
                  style={{
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                  src={application.image}
                  alt={application.name}
                  fluid
                />
              </Card>
            </Col>

            {/* Author Details */}
            <Col md={3}>
              <Card className="h-100">
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

            {/* Pricing and Actions */}
            <Col md={3}>
              <Card className="h-100">
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
                      <Col>
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
                      disabled={!application.isAvailable}
                      onClick={addToCartHandler}
                      style={{ cursor: application.isAvailable ? "pointer" : "not-allowed" }}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* Demo, Documentation, and GitHub Links */}
          <Row className="my-3">
            <Col>
              <div className="d-grid gap-4" style={{ margin: "4rem" }}>
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
            </Col>
          </Row>

          {/* Application Description */}
          <Row>
            <Col md={12}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{application.name || "N/A"}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={application.rating} text={`${application.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item style={{ fontSize: "1.3rem", lineHeight: "2rem" }}>
                  <strong>Description:</strong> {application.description || "N/A"}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>

          {/* Previews */}
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

          {/* Features, Stack, and Tags */}
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


          {/* Reviews */}
          <Row className="review">
            <Col md={12}>
              <h2>Reviews</h2>
              {application.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {application.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {loadingApplicationReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button style={{margin: '0 45%'}} disabled={loadingApplicationReview} type="submit" variant="primary">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default ApplicationScreen;