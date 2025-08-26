import { Container, Row, Spinner } from "react-bootstrap";
import Pagination from "../../utils/Pagination";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllSubCategoriesAction,
  reorderSubCategoryAction,
  resetSuccess,
} from "../../redux/slice/subCategories/subCategoriesSlice";
import { Link, useParams } from "react-router-dom";
import notify from "../../utils/useNotification";
import { Draggable } from "react-drag-reorder";
import { usePermissions } from "../../context/PermissionsContext";
import { PermissionsEnum } from "../../constant/permissions";
import CategoryCard from "../../components/Admin/category/CategoryCard";

/**
 * `SubCategoriesContainer` renders and manages sub-category cards.
 * Supports drag-and-drop reordering, pagination, and loading states.
 *
 * @param {Object} props - Component props
 * @param {Array} props.Subcategories - List of sub-category data
 * @param {boolean} props.loading - Whether the data is loading
 * @param {Function} props.setPage - Function to update current page
 * @param {number} props.page - Current page number
 * @param {string} props.to - Base URL to link each sub-category
 * @returns {JSX.Element} Sub-category cards with reorder and pagination
 */
export const SubCategoriesContainer = ({
  Subcategories,
  loading,
  setPage,
  page,
  to,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [subId, setSubId] = useState("");
  const containerRef = useRef(null);
  const { hasPermission } = usePermissions();

  /**
   * Renders a single sub-category card.
   *
   * @param {Object} item - Sub-category data
   * @returns {JSX.Element} Card component
   */
  const renderSubCategory = (item) => {
    return (
      <CategoryCard
        key={item.id}
        title={item.name}
        title2={item.translations}
        id={item.id}
        img={item.image}
        page={page}
        is_active={item.is_active}
        setMasterId={setSubId}
        to={item.content === 1 ? "/admin/category" : `${to}/${item.id}`}
        is_sub={true}
        parentCategory={item.category_id}
      />
    );
  };

  /**
   * Changes the page during pagination.
   *
   * @param {number} page - Page number to switch to
   */
  const onPress = async (page) => {
    await dispatch(resetSuccess());
    setPage(page);
  };

  /**
   * Fetches the current sub-categories for the given category ID and page.
   */
  const getSubCats = async () => {
    await dispatch(getAllSubCategoriesAction({ id, page }));
  };

  /**
   * Handles reordering of sub-categories by drag-and-drop.
   *
   * @param {number} currentPos - Original position of the dragged item
   * @param {number} newPos - New intended position
   */
  const getChangedPos = async (currentPos, newPos) => {
    if (
      newPos < 0 ||
      newPos >= Subcategories?.data?.length ||
      currentPos === newPos
    ) {
      return;
    }

    const originalItem = Subcategories?.data[newPos];
    if (originalItem.index === 0) {
      return;
    }

    const res = await dispatch(
      reorderSubCategoryAction({
        id: subId,
        index: originalItem.index,
        id2: id,
      })
    );

    if (res.payload.status === true) {
      notify(res.payload.message, "success");
      getSubCats();
    } else {
      notify(res.payload.message, "error");
    }
  };

  /**
   * Enables auto-scrolling during drag when mouse nears screen edges.
   */
  useEffect(() => {
    const handleScrollOnDrag = (event) => {
      const container = containerRef.current;
      if (!container) return;

      const scrollSpeed = 20;
      const margin = 400;
      const { clientY } = event;

      if (clientY < margin) {
        window.scrollBy(0, -scrollSpeed);
      }

      if (clientY > window.innerHeight - margin) {
        window.scrollBy(0, scrollSpeed);
      }
    };

    document.addEventListener("dragover", handleScrollOnDrag);
    return () => document.removeEventListener("dragover", handleScrollOnDrag);
  }, []);

  return (
    <Container ref={containerRef}>
      <Row
        className="d-flex justify-content-center gap-4"
        style={{ minHeight: "calc(100vh - 200px)", alignItems: "start" }}
      >
        {loading ? (
          <Spinner className="m-auto" animation="border" variant="primary" />
        ) : Subcategories && Subcategories.data?.length > 0 ? (
          // <Draggable onPosChange={getChangedPos}>
          //   {Subcategories.data.map((item) => renderSubCategory(item))}
          // </Draggable>

          <>            {Subcategories.data.map((item) => renderSubCategory(item))}
</>
        ) : (
          <>
            <h3 className="m-auto mt-5 text-center">لا يوجد بيانات</h3>
            <Link to={`/admin/category/${id}/subCategory/0`}>
              <h3 className="m-auto text-center">هل تريد اضافة عناصر مباشرة</h3>
            </Link>
          </>
        )}
      </Row>

      {Subcategories?.meta?.total_pages > 1 && (
        <Pagination
          onPress={onPress}
          pageCount={Subcategories.meta.total_pages}
        />
      )}
    </Container>
  );
};
