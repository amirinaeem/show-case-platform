import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import { useGetApplicationsQuery, useCreateApplicationMutation } from '../../slices/applicationsSlice';
import ReactPaginate from 'react-paginate';

function ApplicationListScreen() {
  const { data: applications, isLoading, error, refetch } = useGetApplicationsQuery();
  const [createApplication, { isLoading: loadingCreate }] = useCreateApplicationMutation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Number of items per page

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Filter applications based on search term
  const filteredApplications = applications?.filter((application) =>
    application.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the total number of pages based on filtered applications
  const pageCount = Math.ceil(filteredApplications?.length / itemsPerPage);

  // Get the current page's data
  const offset = currentPage * itemsPerPage;
  const currentApplications = filteredApplications?.slice(offset, offset + itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Delete application handler
  const deleteHandler = (id) => {
    console.log('delete', id);
  };

  // Create application handler
  const createApplicationHandler = async () => {
    if (window.confirm('Are you sure you want to create a new application?')) {
      try {
        await createApplication();
        refetch(); // Refetch the applications list
        toast.success('Application created successfully');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <div className="application-list-container">
      <Row style={{ marginTop: '2rem', marginBottom: '2rem' }} className="align-items-center">
        <Col md="8">
          <h1>Applications Management</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createApplicationHandler} disabled={loadingCreate}>
            <FaEdit /> Create Application
          </Button>
        </Col>
      </Row>

      {/* Search Bar */}
      <Row className="mb-3 search-bar">
        <Col md="6">
          <Form.Control
            type="text"
            placeholder="Search by application name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0); // Reset to the first page when searching
            }}
          />
        </Col>
      </Row>

      {loadingCreate && <Loader />}

      {isLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : error ? (
        <div className="message-container">
          <Message variant="danger">{error}</Message>
        </div>
      ) : (
        <>
          {/* Vertical Card Layout */}
          {currentApplications?.map((application) => (
            <Card key={application._id} className="application-card mb-3">
              <Card.Body>
                <Row>
                  <Col md={8}>
                    {/* Application Image */}
                    {application.image && (
                      <div className="mb-3">
                        <img
                          src={application.image}
                          alt={application.name}
                          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                      </div>
                    )}

                    <h5>{application.name}</h5>
                    <p>
                      <strong>Description:</strong> {application.description}
                    </p>
                    <p><strong>Application preivew</strong>
                    {/* Application Video */}
                    {application.previews?.map((preview, index) => (
                      <div key={index} className="mb-3">
                        {preview.type === 'video' && (
                          <video controls style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}>
                            <source src={preview.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ))}
                    </p>
                    <p>
                      <strong>Programming Language:</strong> {application.programmingLanguage}
                    </p>
                    <p>
                      <strong>Framework:</strong> {application.framework}
                    </p>
                    <p>
                      <strong>Database:</strong> {application.database}
                    </p>
                    <p>
                      <strong>License Type:</strong> {application.licenseType}
                    </p>
                    <p>
                      <strong>Price:</strong> ${application.price}
                    </p>
                    <p>
                      <strong>Demo Link:</strong>{' '}
                      <a href={application.demoLink} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </p>
                    <p>
                      <strong>Documentation Link:</strong>{' '}
                      <a href={application.documentationLink} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </p>
                    <p>
                      <strong>GitHub Repository:</strong>{' '}
                      <a href={application.githubRepo} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </p>
                    <p>
                      <strong>Support Details:</strong> {application.supportDetails?.type} (
                      {application.supportDetails?.duration})
                    </p>
                    <p>
                      <strong>Features:</strong>
                      <ul>
                        {application.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </p>
                    <p>
                      <strong>Author Details:</strong>
                      <ul>
                        <li>
                          <strong>Name:</strong> {application.authorDetails?.name}
                        </li>
                        <li>
                          <strong>Portfolio Link:</strong>{' '}
                          <a
                            href={application.authorDetails?.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Link
                          </a>
                        </li>
                        <li>
                          <strong>Last Update:</strong> {application.authorDetails?.lastUpdate}
                        </li>
                        <li>
                          <strong>Published Date:</strong> {application.authorDetails?.published}
                        </li>
                        <li>
                          <strong>High Resolution:</strong>{' '}
                          {application.authorDetails?.highResolution ? 'Yes' : 'No'}
                        </li>
                        <li>
                          <strong>Compatible Browsers:</strong>{' '}
                          {application.authorDetails?.compatibleBrowsers.join(', ')}
                        </li>
                        <li>
                          <strong>Compatible With:</strong> {application.authorDetails?.compatibleWith}
                        </li>
                        <li>
                          <strong>Documentation:</strong> {application.authorDetails?.documentation}
                        </li>
                        <li>
                          <strong>Layout:</strong> {application.authorDetails?.layout}
                        </li>
                      </ul>
                    </p>
                    <p>
                      <strong>Tags:</strong> {application.tags.join(', ')}
                    </p>
                    <p>
                      <strong>Available:</strong>{' '}
                      {application.isAvailable ? (
                        <FaCheck style={{ color: 'green' }} />
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </p>


                  </Col>
                  <Col md={4} className="text-end">
                    <LinkContainer to={`/admin/application/${application._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit /> Edit
                      </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(application._id)}>
                      <FaTrash style={{ color: 'white' }} /> Delete
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {/* Pagination */}
          <Row className="justify-content-center mt-4">
            <Col md="auto">
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default ApplicationListScreen;