import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, onPress }) => {
  const handlePageClick = (data) => {
    onPress(data.selected + 1);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<GrLinkNext />}
      onPageChange={handlePageClick}
      // marginPagesDisplayed={1}
      // pageRangeDisplayed={1}
      pageCount={pageCount}
      previousLabel={<GrLinkPrevious />}
      containerClassName={
        "pagination justify-content-center align-items-center my-4"
      }
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      previousClassName={"page-item"}
      nextClassName={"page-item"}
      previousLinkClassName={"page-link"}
      nextLinkClassName={"page-link"}
      breakClassName={"page-item"}
      breakLinkClassName={"page-link"}
      activeClassName={"active"}
    />
  );
};

export default Pagination;
