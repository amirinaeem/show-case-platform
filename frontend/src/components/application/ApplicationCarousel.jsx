import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from '../helpers/Message';
import { useGetTopApplicationsQuery } from '../../slices/applicationsSlice';

const ApplicationCarousel = () => {
  const { data: applications, isLoading, error } = useGetTopApplicationsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-primary mb-5 mt-5'>
      {applications.map((application) => (
        <Carousel.Item key={application._id}>
          <Link to={`/application/${application._id}`}>
            <Image style={{height: '500px', width: '100%'}} src={application.image} alt={application.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2 className='text-white text-right'>
                {application.name} (${application.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ApplicationCarousel;

