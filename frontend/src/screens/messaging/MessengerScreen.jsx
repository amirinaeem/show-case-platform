import '../../assets/styles/messaging/messengerScreen.css';
import { Container, Row, Col } from 'react-bootstrap';
import LeftSide from '../../components/messaging/LeftSide';
import RightSide from '../../components/messaging/RightSide';
import Messenger from '../../components/messaging/Messenger';

const MessengerScreen = () => {
  return (
    <Container fluid className="messenger">
      <Row className="h-100">
        <Col md={3}>
          <LeftSide />
        </Col>
        <Col md={6}>
          <Messenger />
        </Col>
        <Col md={3}>
          <RightSide />
        </Col>
      </Row>
    </Container>
  );
};


console.log(LeftSide)

export default MessengerScreen;
