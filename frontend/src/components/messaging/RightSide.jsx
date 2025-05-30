
import { Container, Card, Accordion, Row, Col, Image } from 'react-bootstrap';
import { FaCaretSquareDown } from 'react-icons/fa';
import '../../assets/styles/messaging/rightSide.css'

const RightSide = () => {
  return (
    <div className="right-side p-3">

      {/* Active Friends */}
      <Container fluid className="px-0 active-friends-container">
        <div className="d-flex flex-nowrap active-friends-scroll">
          {[1].map((i) => (
            <div key={i} className="position-relative mx-2 active-friend-item">
              <Image
                src="SHCAPL-logo.jpg"
                alt="user profile"
                roundedCircle
                className="friend-avatar"
              />
              <div className="active-indicator" />
            </div>
          ))}
        </div>
      </Container>

      {/* Friend Info */}
      <Card className="friend-info-card">
        <Card.Body className="p-3">
          {/* Profile Section */}
          <Container className="text-center mb-4">
            <div className="position-relative d-inline-block">
              <Image
                src="SHCAPL-logo.jpg"
                alt="friend profile"
                roundedCircle
                className="friend-avatar"
              />
              <span className="active-badge">Active</span>
            </div>
            <h4 className="mt-3 friend-name">Friend Name</h4>
          </Container>

          {/* Options Accordion */}
          <Accordion defaultActiveKey="0" flush className="options-accordion">
            <Accordion.Item eventKey="0" className="border-0">
              <Accordion.Header className="option-header">
                <span>Customize Chat</span>
                <FaCaretSquareDown className="accordion-icon" />
              </Accordion.Header>
              <Accordion.Body>
                <div className="text-muted">Chat customization options</div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" className="border-0">
              <Accordion.Header className="option-header">
                <span>Privacy and Support</span>
                <FaCaretSquareDown className="accordion-icon" />
              </Accordion.Header>
              <Accordion.Body>
                <div className="text-muted">Privacy settings</div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" className="border-0">
              <Accordion.Header className="option-header">
                <span>Shared Media</span>
                <FaCaretSquareDown className="accordion-icon" />
              </Accordion.Header>
              <Accordion.Body>
                <Row className="gallery-grid g-2">
                  {[1, 2, 3, 4].map((item) => (
                    <Col xs={6} key={item}>
                      <Image
                        src="SHCAPL-logo.jpg"
                        alt="shared media"
                        thumbnail
                        className="gallery-image"
                      />
                    </Col>
                  ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>

    </div>
  );
};

export default RightSide;
