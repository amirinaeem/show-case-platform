import { Card, Accordion, Row, Col, Image } from 'react-bootstrap';
import { FaCaretDown, FaPhoneAlt, FaVideo, FaEllipsisV } from 'react-icons/fa';
import { BsCheck2Circle } from 'react-icons/bs';
import '../../../assets/styles/messaging/rightSide.css';

const RightSide = ({ selectFriend, connectedUsers }) => {
  
  const isActive = connectedUsers.some(user => user.id === selectFriend._id);

  console.log('from right side', isActive)

  return (
    <div className="right-side mb-5">
      {/* User Profile Header */}
      <div className="profile-header p-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Profile</h5>
        <div className="d-flex">
          <button className="icon-button me-2">
            <FaPhoneAlt />
          </button>
          <button className="icon-button me-2">
            <FaVideo />
          </button>
          <button className="icon-button">
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="profile-card border-0 shadow-sm">
        <Card.Body className="p-4 text-center">
          <div className="position-relative d-inline-block mb-3">
            <Image
              src={selectFriend.avatar}
              alt={selectFriend.name}
              roundedCircle
              width={120}
              height={120}
              className="border border-3 border-primary"
            />
            {isActive && (
    <div className="online-indicator-right">
      <span className="online-circle-right"></span>
    </div>
  )}
          </div>
          <h4 className="mb-1">{selectFriend.name}</h4>
          <p className="text-muted mb-3">
            {isActive ? 'Active now' : 'Last seen recently'}
          </p>
          
          <div className="d-flex justify-content-center mb-4">
            <div className="text-center mx-3">
              <div className="fw-bold">1.2K</div>
              <small className="text-muted">Friends</small>
            </div>
            <div className="text-center mx-3">
              <div className="fw-bold">568</div>
              <small className="text-muted">Following</small>
            </div>
            <div className="text-center mx-3">
              <div className="fw-bold">4.5K</div>
              <small className="text-muted">Followers</small>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Profile Details Accordion */}
      <Accordion defaultActiveKey="0" className="profile-accordion mt-3">
        <Accordion.Item eventKey="0" className="border-0">
          <Accordion.Header className="accordion-header">
            <div className="d-flex align-items-center">
              <BsCheck2Circle className="me-2" />
              <span>About</span>
            </div>
            <FaCaretDown className="ms-auto" />
          </Accordion.Header>
          <Accordion.Body className="text-muted">
            <div className="mb-2">
              <small>Bio</small>
              <p className="mb-0">Hey there! I'm using this awesome chat app</p>
            </div>
            <div className="mb-2">
              <small>Email</small>
              <p className="mb-0">{selectFriend.email || 'Not available'}</p>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1" className="border-0">
          <Accordion.Header className="accordion-header">
            <div className="d-flex align-items-center">
              <BsCheck2Circle className="me-2" />
              <span>Media Shared</span>
            </div>
            <FaCaretDown className="ms-auto" />
          </Accordion.Header>
          <Accordion.Body>
            <Row className="g-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Col xs={4} key={item}>
                  <Image
                    src={`https://picsum.photos/200/200?random=${item}`}
                    alt="Media"
                    thumbnail
                    className="gallery-item"
                  />
                </Col>
              ))}
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default RightSide;