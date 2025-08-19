import { Container, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import AdvCard from "../../components/Admin/ads/AdvCard";
import { resetSuccess } from "../../redux/slice/ads/adsSlice";
import Pagination from "../../utils/Pagination"; // Assuming this is your pagination component
import { useEffect } from "react";

/**
 * AdsContainer Component
 *
 * Displays a responsive grid of advertisement cards.
 * Handles:
 * - Loading state
 * - Empty state
 * - Pagination
 *
 * @param {Object} props
 * @param {Array} props.ads - The advertisement data from Redux
 * @param {boolean} props.loading - Loading indicator from API call
 * @param {Function} props.setPage - Function to update the current page
 * @param {number} props.page - Current page number
 * @param {string} [props.to] - Optional: not used in current version but could represent navigation path
 */
const AdsContainer = ({ ads, loading, setPage, page, to , refresh }) => {
  const dispatch = useDispatch();

  /**
   * Handles page change in pagination
   * - Sets the new page
   * - Resets the success flag in Redux (to allow form reuse or messages reset)
   *
   * @param {number} page - New page number
   */
  const onPress = async (page) => {
    setPage(page);
    await dispatch(resetSuccess());
  };
  useEffect(()=> {} , [refresh])

  return (
    <Container>
      <Row
        className="d-flex justify-content-center gap-4"
        style={{ minHeight: "" }}
      >
        {/* Render ads or fallback states based on loading and content */}
        {loading === false ? (
          ads && ads.data && ads.data.length > 0 ? (
            // Render ad cards
            ads.data.map((item) => (
              <AdvCard
                key={item.id}
                title={item.title}
                id={item.id}
                img={item.image}
                from_date={item.from_date}
                to_date={item.to_date}
                page={page}
                is_panorama={item.is_panorama}
                hide_date={item.hide_date}
              />
            ))
          ) : (
            // No data found
            <div
              style={{
                minHeight: "calc(100vh - 340px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h3 className="m-auto text-center">لا يوجد بيانات</h3>
            </div>
          )
        ) : (
          // Loading spinner
          <div
            style={{
              minHeight: "calc(100vh - 340px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner
              className="my-5 m-auto"
              animation="border"
              variant="primary"
            />
          </div>
        )}

        {/* Pagination - only show if multiple pages exist */}
        {ads && ads.meta?.total_pages > 1 && (
          <Pagination onPress={onPress} pageCount={ads.meta.total_pages} />
        )}
      </Row>
    </Container>
  );
};

export default AdsContainer;
