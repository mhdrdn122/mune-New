/**
 * ItemsContainer Component
 * 
 * Displays a grid of draggable item cards with pagination support.
 * Handles reordering of items via drag-and-drop and auto-scroll while dragging.
 * 
 * Props:
 * @param {Object} items - The paginated list of item data from Redux state.
 * @param {boolean} loading - Indicates if the data is currently loading.
 * @param {Function} setPage - Updates the current page number for pagination.
 * @param {number} page - The current page number.
 * @param {string|number} masterId - The main category ID.
 * 
 * Return:
 * @returns {JSX.Element} A container with draggable cards and optional pagination.
 */

import { Container, Row, Spinner } from "react-bootstrap";
import Pagination from "../../../utils/Pagination";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ItemCard from "./ItemCard";
import notify from "../../../utils/useNotification";
import { Draggable } from "react-drag-reorder";
import {
  getAllItemsAction,
  reorderItemAction,
  resetSuccess,
} from "../../../redux/slice/items/itemsSlice";

export const ItemsContainer = ({ items, loading, setPage, page, masterId }) => {
  const { id, subId } = useParams();
  const dispatch = useDispatch();
  const [itemId, setItemId] = useState("");
  const containerRef = useRef();

  /**
   * Change page number.
   * @param {number} newPage - The new page number to navigate to.
   */
  const onPress = async (newPage) => {
    await dispatch(resetSuccess());
    setPage(newPage);
  };

  /**
   * Fetch items from the API for the given category.
   */
  const getItems = async () => {
    await dispatch(getAllItemsAction({ id: masterId, subId, page }));
  };

  /**
   * Handle item reorder after drag event.
   * 
   * @param {number} currentPos - Original index of the dragged item.
   * @param {number} newPos - New index after drag.
   */
  const getChangedPos = async (currentPos, newPos) => {
    if (
      newPos < 0 ||
      newPos >= items?.data?.length ||
      currentPos === newPos
    )
      return;

    const targetItem = items?.data[newPos];
    if (targetItem.index === 0) return;

    const res = await dispatch(
      reorderItemAction({
        id: itemId,
        index: targetItem.index,
        id2: subId === "0" ? id : subId,
      })
    );

    notify(res.payload.message, res.payload.status ? "success" : "error");
    if (res.payload.status) getItems();
  };

  /**
   * Auto-scroll page when dragging item near top/bottom.
   */
  useEffect(() => {
    const handleScrollOnDrag = (event) => {
      const scrollSpeed = 20;
      const margin = 200;
      const { clientY } = event;

      if (clientY < margin) window.scrollBy(0, -scrollSpeed);
      if (clientY > window.innerHeight - margin) window.scrollBy(0, scrollSpeed);
    };

    document.addEventListener("dragover", handleScrollOnDrag);
    return () => document.removeEventListener("dragover", handleScrollOnDrag);
  }, []);

  /**
   * Render a single item card.
   * @param {Object} item - Item data to render.
   * @returns {JSX.Element}
   */
  const renderItemCard = (item) => (
    <ItemCard key={item.id} item={item} page={page} setItemId={setItemId} />
  );

  /**
   * Render all items as draggable cards or fallback if no data.
   * @returns {JSX.Element|string}
   */
  const renderItems = () => {
    if (!items?.data || items.data.length === 0) {
      return <h3 className="m-auto text-center">لا يوجد بيانات</h3>;
    }

    return (
      <> 
       {/* <Draggable onPosChange={getChangedPos} p={0}> */}
        {items.data.map(renderItemCard)}
       {/* </Draggable> */}
      </>
      
    );
  };

  return (
    <Container p={0}>
      <Row
        className="flex gap-4 flex-wrap justify-center  items-center"
        style={{ minHeight: "calc(100vh - 200px)", alignItems: "start"  }}
        ref={containerRef}
      >
        {loading ? (
          <Spinner className="m-auto" animation="border" variant="primary" />
        ) : (
          renderItems()
        )}
      </Row>

      {items?.meta?.total_pages > 1 && (
        <Pagination onPress={onPress} pageCount={items.meta.total_pages} />
      )}
    </Container>
  );
};
