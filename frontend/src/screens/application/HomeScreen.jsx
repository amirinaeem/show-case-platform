import { Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { useGetApplicationsQuery } from '../../slices/applicationsSlice.js';
import Application from '../../components/application/Application.jsx';
import Paginate from '../../components/helpers/Paginate.jsx';
import Loader from '../../components/helpers/Loader.jsx';
import Message from '../../components/helpers/Message.jsx';
import ApplicationCarousel from '../../components/application/ApplicationCarousel.jsx';
import UsersHomeScreen from '../users/UsersHomeScreen.jsx';
import MessengerScreen from '../messaging/MessengerScreen.jsx';

function HomeScreen() {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, isError } = useGetApplicationsQuery({ keyword, pageNumber });
  const [showChat, setShowChat] = useState(false);
  

  return (
    <>
      {!keyword ? (
        <ApplicationCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <Container fluid className="p-0 h-100 position-relative">
          <Row className="g-0 h-100">
            <Col xl={3} lg={3} md={4} className="h-100">
              <UsersHomeScreen />
            </Col>

            <Col xl={9} lg={9} md={8} className="p-3 h-100 overflow-auto">
              <h1>Latest Applications</h1>
              <Row>
                {data.applications.map((app) => (
                  <Col key={app._id} sm={12} className="mb-4">
                    <Application application={app} />
                  </Col>
                ))}
              </Row>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword || ''}
              />
            </Col>
          </Row>

              {/* Chat Interface */}
              
             
{showChat && (
  <div
    className="position-fixed shadow-lg rounded d-flex flex-column"
    style={{
      bottom: '90px',
      right: '20px',
      width: '80vh',
      height: '60vh',
      maxHeight: '80vh',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ccc',
      borderRadius: '12px',
      zIndex: 1050,
      overflow: 'hidden' // This is correct - keeps parent from scrolling
    }}
  >
    <MessengerScreen 
      onClose={() => setShowChat(false)}
    />
  </div>
)}

          {/* Floating Chat Toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="position-fixed d-flex align-items-center justify-content-center p-0 border-0"
            style={{
              bottom: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: showChat ? '#dc3545' : '#007bff',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1060,
              cursor: 'pointer'
            }}
            aria-label={showChat ? 'Close chat' : 'Open chat'}
          >
            {showChat ? (
              <span style={{ fontSize: '24px', lineHeight: 1 }}>×</span>
            ) : (
              <FiMessageSquare size={24} />
            )}
          </button>
        </Container>
      )}
    </>
  );
}

export default HomeScreen;