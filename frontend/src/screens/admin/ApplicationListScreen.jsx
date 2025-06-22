
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaTimes, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import Loader from '../../components/helpers/Loader';
import { toast } from 'react-toastify';
import Message from '../../components/helpers/Message';
import { useGetApplicationsQuery, useCreateApplicationMutation, useDeleteApplicationMutation } from '../../slices/applicationsSlice';
import Paginate from '../../components/helpers/Paginate';



function ApplicationListScreen() {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetApplicationsQuery({pageNumber});
  const [createApplication, { isLoading: loadingCreate }] = useCreateApplicationMutation();
  const [deleteApplication, { isLoading: loadingDelete }] = useDeleteApplicationMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteApplication(id);
        toast.success('Application Deleted');
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const createApplicationHandler = async () => {
    if (window.confirm('Are you sure you want to create a new application?')) {
      try {
        await createApplication();
        refetch();
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
          <h1 className="page-title">Applications Management</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3 create-button" onClick={createApplicationHandler} disabled={loadingCreate}>
            <FaEdit /> Create Application
          </Button>
        </Col>
      </Row>

 

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

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
          {/* Table Layout */}
          <div className="table-container">
            <Table striped bordered hover responsive className="custom-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>LANGUAGE</th>
                  <th>FRAMEWORK</th>
                  <th>DATABASE</th>
                  <th>LICENSE</th>
                  <th>PRICE</th>
                  <th>SUPPORT</th>
                  <th>AVAIL</th>
                  <th>EDIT</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {data.applications?.map((application) => (
                  <tr key={application._id}>
                    <td>{application.name}</td>
                    <td>{application._id}</td>
                    <td>{application.programmingLanguage}</td>
                    <td>{application.framework}</td>
                    <td>{application.database}</td>
                    <td>{application.licenseType}</td>
                    <td>${application.price}</td>
                    <td>
                      {application.supportDetails?.type} ({application.supportDetails?.duration})
                    </td>
                    <td>
                      {application.isAvailable ? (
                        <FaCheck style={{ color: 'green' }} />
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/admin/application/${application._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2 edit-button">
                          <FaEdit /> Edit
                        </Button>
                      </LinkContainer>
                    </td>
                    <td>
                      <Button variant="danger" className="btn-sm delete-button" onClick={() => deleteHandler(application._id)}>
                        <FaTrash style={{ color: 'white' }} /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

              {/* Pagination */}
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </div>
  );
}

export default ApplicationListScreen;