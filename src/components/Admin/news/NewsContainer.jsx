/**
 * NewsContainer
 * This component is used to display and manage a list of news items for the admin panel.
 * It supports pagination, loading states, error handling, and renders AddNews modal.
 *
 * @param {boolean} show - Determines whether the AddNews modal should be visible.
 * @param {function} handleClose - Callback function to close the AddNews modal.
 * @param {number} refresh - A number used to trigger data refresh (typically a random number).
 *
 * @returns {JSX.Element} Rendered component with news cards and pagination.
 */

import { useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import AddNews from "./AddNews";
import { useGetNewsQuery } from "../../../redux/slice/news/newsApi";
import Pagination from "../../../utils/Pagination";
import NewsCard from "./NewsCard";
import useError401Admin from "../../../hooks/useError401Admin";

/**
 * NewsContainer component implementation
 */
const NewsContainer = ({ show, handleClose, refresh }) => {
  const [page, setPage] = useState(1);

  // Fetching news from Redux Toolkit Query API
  const {
    data: news,
    isError,
    error,
    isLoading: loading,
    isFetching
  } = useGetNewsQuery({ page, refresh });

  // Handles redirection if error 401 is encountered (unauthorized access)
  const { triggerRedirect } = useError401Admin(isError, error);

  /**
   * onPress
   * Handles page changes for pagination
   * @param {number} page - The new page number to be set
   */
  const onPress = async (page) => {
    setPage(page);
  };

  return (
    <Container>
      <Row
        className="d-flex justify-content-center gap-4"
        style={{ minHeight: "" }}
      >
        {/* Render news list or loading spinner or no data message */}
        {isFetching === false ? (
          news?.data?.length > 0 ? (
            news.data.map((item) => {
              return <NewsCard key={item.id} item={item} />;
            })
          ) : (
            <h3 className="m-auto text-center my-5">لا يوجد بيانات</h3>
          )
        ) : (
          <div
            style={{
              minHeight: "calc(100vh - 340px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner className="m-auto" animation="border" variant="primary" />
          </div>
        )}

        {/* Modal for adding news */}
        <AddNews show={show} handleClose={handleClose} />
      </Row>

      {/* Pagination component if multiple pages exist */}
      {news?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={news.meta.total_pages} />
      )}

      {/* Optional: Toast notifications container (currently commented out) */}
      {/* <ToastContainer /> */}
    </Container>
  );
};

export default NewsContainer;
