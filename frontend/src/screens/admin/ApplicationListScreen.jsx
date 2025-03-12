import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import { useGetApplicationsQuery, useCreateApplicationMutation } from '../../slices/applicationsSlice';

function ApplicationListScreen() {
  const { data: applications, isLoading, error, refetch } = useGetApplicationsQuery();
  console.log(applications)
  const [createApplication, { isLoading: loadingCreate }] = useCreateApplicationMutation();

  const deleteHandler = (id) => {
    console.log('delete', id);
  };

  const createApplicationHandler = async () => {
    if (window.confirm('Are you sure you want to create a new application?')) {
      try {
        // Create a default application object with all required fields
        const newApplication = {
          name: 'New Application',
          price: 0,
          image: 'SHCAPL-logo.jpg',
          framework: 'Sample Framework',
          description: 'Sample description',
          platform: 'Web',
          programmingLanguage: 'JavaScript',
          database: 'MongoDB',
          licenseType: 'Single License',
          demoLink: 'https://demo.example.com', // Add a default value
          documentationLink: 'https://docs.example.com', // Add a default value
          githubRepo: 'https://github.com/example', // Add a default value
          supportDetails: {
            type: 'Email support',
            duration: '6 months',
          },
          features: [],
          previews: [],
          authorDetails: {
            name: 'Sample Author',
            portfolioLink: 'https://portfolio.example.com', // Add a default value
            lastUpdate: new Date().toISOString(),
            published: new Date().toISOString(),
            highResolution: false,
            compatibleBrowsers: [],
            compatibleWith: 'Bootstrap 5.x', // Add a default value
            documentation: 'Well Documented', // Add a default value
            layout: 'Responsive', // Add a default value
          },
          tags: [],
          isAvailable: false,
        };
  
        // Call the createApplication mutation with the newApplication object
        await createApplication(newApplication).unwrap();
        refetch(); // Refetch the applications list
        toast.success('Application created successfully');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Applications</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3' onClick={createApplicationHandler} disabled={loadingCreate}>
            <FaEdit /> Create Application
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PLATFORM</th>
              <th>FRAMEWORK</th>
              <th>PRICE</th>
              <th>RATING</th>
              <th>AVAILABLE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id}>
                <td>{application._id}</td>
                <td>{application.name}</td>
                <td>{application.platform}</td>
                <td>{application.framework}</td>
                <td>${application.price}</td>
                <td>{application.rating}</td>
                <td>
                  {application.isAvailable ? (
                    <FaTimes style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/application/${application._id}/edit`}>
                    <Button variant='light' className='btn-sm mx-2'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                </td>
                <td>
                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(application._id)}>
                    <FaTrash style={{ color: 'white' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default ApplicationListScreen;