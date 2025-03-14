import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
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
        await createApplication();
        refetch(); // Refetch the applications list
        toast.success('Application created successfully');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <Row style={{ marginTop: '2rem', marginBottom: '2rem'}} className='align-items-center'>
        <Col md='8' >
          <h1>Applications Managment</h1>
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
                <th>NAME</th>
                <th>LICENSE TYPE</th>
                <th>PRICE</th>
                <th>Rating</th>
                <th>COMMENTS</th>
                <th>LIKES</th>
                <th>SHARES</th>
                <th>FRAMEWORK</th>
                <th>AVAILABLE</th>
                <th>EDITE</th>
                <th>DELETE</th>
                  
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id}>
                
                <td className="text-truncate" style={{ maxWidth: '150px' }}>{application.name}</td>
                <td>{application.licenseType}</td>
                <td>${application.price}</td>
                <td>{application.rating}</td>
                <td>{application.comments.length}</td>
                <td>{application.likes.length}</td>
                <td>{application.shares.length}</td>
                <td>{application.framework}</td>
                <td>
                  {application.isAvailable ? (
                    <FaCheck style={{ color: 'green' }} />
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