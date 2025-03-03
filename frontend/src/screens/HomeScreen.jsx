import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Application from '../components/Application'; 
import axios from 'axios';

function HomeScreen() {

  const [applicationsData, setApplicationsData] = useState([]);

  useEffect(() => {
    const fetchApplicationsData = async () => {
      const {data} = await axios.get('/api/applications');
      setApplicationsData(data)
    };
    fetchApplicationsData()
  }, []);


  return (
    <Container fluid className="p-0"> 
      <Row className="g-0"> 
        <Col md={10} className="p-3">
          <h1>Latest Applications</h1>
          <Row>
            {applicationsData.map((app) => (
              <Col key={app._id} sm={12} md={12} lg={12} xl={12} className="mb-4">
                <Application application={app} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default HomeScreen;