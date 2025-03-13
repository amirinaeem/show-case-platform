import { useState } from 'react';
import { useSelector } from 'react-redux'; // Removed useDispatch
import { toast } from 'react-toastify';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating'; // Adjust the import path if necessary
import { useLikeApplicationMutation, useAddCommentMutation, useShareApplicationMutation } from '../slices/applicationsSlice'; // Updated import path

function Application({ application }) {
  const { userInfo } = useSelector((state) => state.auth);

  const [likeApplication] = useLikeApplicationMutation();
  const [addComment] = useAddCommentMutation();
  const [shareApplication] = useShareApplicationMutation();

  const [commentText, setCommentText] = useState('');
  const [showCommentTextarea, setShowCommentTextarea] = useState(false); // State to control textarea visibility

  const handleLike = async () => {
    try {
      await likeApplication(application._id).unwrap();
      toast.success('Application liked successfully');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleComment = async () => {
    if (!showCommentTextarea) {
      // Show the textarea if it's hidden
      setShowCommentTextarea(true);
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await addComment({ id: application._id, text: commentText }).unwrap();
      setCommentText('');
      setShowCommentTextarea(false); // Hide the textarea after posting
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleShare = async () => {
    try {
      await shareApplication(application._id).unwrap();
      toast.success('Application shared successfully');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Card
      className="mb-2 shadow-sm"
      style={{
        height: "auto",
        border: "1px solid #dee2e6",
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
          <Card.Text className="text-muted small mb-1">
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
            </div>
          )}
        </Col>
      </Row>

      {/* Like, Comment, and Share Buttons in a new row */}
      <Row className="mt-3" style={{borderTop: '1px solid #dee2e6', paddingTop: '1rem'}}>
        <Col>
          <div className="d-flex justify-content-between">
            <Button variant="outline-primary" onClick={handleLike}>
              <i className="fas fa-thumbs-up"></i> Like ({application.likes.length})
            </Button>
            <Button variant="primary" onClick={handleComment}>
              {showCommentTextarea ? 'Post Comment' : 'Add Comment'}
            </Button>
            <Button variant="outline-success" onClick={handleShare}>
              <i className="fas fa-share"></i> Share ({application.shares})
            </Button>
          </div>
        </Col>
      </Row>

      {/* Comment Section */}
      <Row className="mt-3">
        <Col>
          {application.comments.map((comment, index) => (
            <div key={index} className="mb-2">
              <strong>{comment.user?.name}:</strong> {comment.text}
            </div>
          ))}
          {userInfo && showCommentTextarea && (
            <div className="mt-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="form-control mb-2"
              />
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
}

export default Application;