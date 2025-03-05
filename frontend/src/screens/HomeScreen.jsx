import { Container, Row, Col } from 'react-bootstrap';
import Application from '../components/Application';
import { useGetApplicationsQuery } from '../slices/applicationsSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function HomeScreen() {
  const { data: applicationsData, isLoading, isError } = useGetApplicationsQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant='danger'>{isError?.data?.message || isError.error}</Message>
      ) : (
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
      )}
    </>
  );
}

export default HomeScreen;