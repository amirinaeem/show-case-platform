import { Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Application from '../components/Application';
import { useGetApplicationsQuery } from '../slices/applicationsSlice';
import Paginate from '../components/Paginate';
import Loader from '../components/Loader';
import Message from '../components/Message';

function HomeScreen() {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetApplicationsQuery({keyword, pageNumber});

  return (
    <>
      {keyword && (<Link to='/' className='btn btn-light mb-4'>Go Back</Link>)}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant='danger'>{isError?.data?.message || isError.error}</Message>
      ) : (
            <Container fluid className="p-0">
              
              <Row className="g-0">
              <Col>filter section</Col>
            <Col md={10} className="p-3">
              <h1>Latest Applications</h1>
              <Row>
                {data.applications.map((app) => (
                  <Col key={app._id} sm={12} md={12} lg={12} xl={12} className="mb-4">
                    <Application application={app} />
                  </Col>
                ))}
              </Row>
            </Col>
              </Row>
              <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
        </Container>
      )}
    </>
  );
}

export default HomeScreen;