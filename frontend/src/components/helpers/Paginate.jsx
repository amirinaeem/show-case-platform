import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {/* Previous Button */}
        <Pagination.Prev
          as={Link}
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${page - 1}`
                : `/page/${page - 1}`
              : `/admin/applicationlist/${page - 1}`
          }
          disabled={page === 1} // Disable if on the first page
        />

        {/* Next Button */}
        <Pagination.Next
          as={Link}
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${page + 1}`
                : `/page/${page + 1}`
              : `/admin/applicationlist/${page + 1}`
          }
          disabled={page === pages} // Disable if on the last page
        />
      </Pagination>
    )
  );
};

export default Paginate;