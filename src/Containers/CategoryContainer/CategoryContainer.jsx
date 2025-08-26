/**
 * File: CategoriesContainer.js
 * Description:
 * - This component displays the list of categories.
 * - Supports drag-and-drop reordering using Draggable.
 * - Handles pagination, scrolling during drag, and category reorder API updates.
 */

import { Container, Row, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { Draggable } from "react-drag-reorder";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { usePermissions } from "../../context/PermissionsContext";
import {
  getAllCategoriesAction,
  reorderCategoryAction,
  resetSuccess,
} from "../../redux/slice/categories/categoriesSlice";
import notify from "../../utils/useNotification";
import CategoryCard from "../../components/Admin/category/CategoryCard";
import { PermissionsEnum } from "../../constant/permissions";
import Pagination from "../../utils/Pagination";
import DynamicSkeleton from "../../utils/DynamicSkeletonProps";

// CategoriesContainer Component
// Props: categories, loading, setPage, page
export const CategoriesContainer = ({ categories, loading, setPage, page }) => {
  const dispatch = useDispatch();
  const [masterId, setMasterId] = useState(""); // ID of the dragged category
  const containerRef = useRef(null); // For scroll management during drag
  const { hasPermission } = usePermissions();

  // Handle page change and reset category fetch success flag
  const onPress = async (page) => {
    await dispatch(resetSuccess());
    setPage(page);
  };

  // Dispatch action to fetch all categories for the current page
  const getCat = async () => {
    await dispatch(getAllCategoriesAction(page));
  };

  /**
   * Handles drag-and-drop position change
   * @param {number} currentPos - Initial index
   * @param {number} newPos - Target index
   */
  const getChangedPos = async (currentPos, newPos) => {
    if (
      newPos < 0 ||
      newPos >= categories?.data?.length ||
      currentPos === newPos
    )
      return;

    const originalItem = categories?.data[newPos];
    if (!originalItem || originalItem.index === 0) return;

    const res = await dispatch(
      reorderCategoryAction({ id: masterId, index: originalItem.index })
    );

    if (res.payload?.status) {
      notify(res.payload.message, "success");
      getCat();
    } else {
      notify(res.payload.message, "error");
    }
  };

  // Render category cards using CategoryCard component
  const renderCategoryCards = () => {
    if (!categories?.data || categories.data.length === 0) {
      return <h3 className="m-auto text-center">لا يوجد بيانات</h3>;
    }

    return categories.data.map((item) => (
      <CategoryCard
        key={item.index}
        title={item.name}
        title2={item.translations}
        id={item.id}
        img={item.image}
        page={page}
        is_active={item.is_active}
        to={
          item.content === 2
            ? `/admin/category/${item.id}/subCategory/0`
            : `/admin/category/${item.id}`
        }
        setMasterId={setMasterId}
      />
    ));
  };

  // Enables scrolling while dragging if the cursor reaches screen edges
  useEffect(() => {
    const handleScrollOnDrag = (event) => {
      const container = containerRef.current;
      if (!container) return;

      const scrollSpeed = 20;
      const margin = 400;
      const { clientY } = event;

      if (clientY < margin) {
        window.scrollBy(0, -scrollSpeed);
      } else if (clientY > window.innerHeight - margin) {
        window.scrollBy(0, scrollSpeed);
      }
    };

    document.addEventListener("dragover", handleScrollOnDrag);
    return () => document.removeEventListener("dragover", handleScrollOnDrag);
  }, []);

  return (
    <div ref={containerRef} className="p-2">
      <div
        className="d-flex justify-content-center gap-4 !flex-wrap"
        // style={{ minHeight: "calc(100vh - 250px)" }}
      >
        {/* Show spinner while loading */}
        {loading ? (
          // <Spinner className="m-auto" animation="border" variant="primary" />
          <DynamicSkeleton
            count={5}
            variant="rounded"
            height={350}
            animation="wave"
            spacing={3}
            columns={{ xs: 12, sm: 6, md: 4 }}
          
          />
        ) : (
          // Render draggable list of category cards
          // <Draggable onPosChange={getChangedPos}>

          // </Draggable>
          <>{renderCategoryCards()} </>
        )}
      </div>

      {/* Pagination section */}
      {categories?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={categories.meta.total_pages} />
      )}

      {/* Notification toast container */}
      <ToastContainer />
    </div>
  );
};
