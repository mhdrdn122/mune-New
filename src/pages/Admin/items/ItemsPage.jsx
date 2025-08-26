// This file manages admin-related interfaces or functionality.

import { useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllItemsAction } from "../../../redux/slice/items/itemsSlice";
import { ItemsContainer } from "../../../components/Admin/item/ItemsContainer";
import { ModalAddItem } from "../../../components/Admin/item/ModalAddItem";
import { ToastContainer } from "react-toastify";
import { PermissionsEnum } from "../../../constant/permissions";
 import SubAppBar from "../../../utils/SubAppBar";

/**
 * `ItemsPage` is a React component for displaying and managing items in a category or subcategory.
 *
 * It allows:
 * - Displaying a list of items.
 * - Adding new items through a modal.
 * - Refreshing and paginating item data.
 */
const ItemsPage = () => {
  const { id, subId } = useParams(); // Route parameters (category and subcategory IDs)
  const [page, setPage] = useState(1); // Current pagination page
  const [showAddItem, setShowAddItem] = useState(false); // Modal state for adding new items
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false); // Trigger for re-fetching data

  /**
   * Opens the modal to add a new item.
   */
  const handleShowAddItem = () => {
    setShowAddItem(true);
  };

  /**
   * Closes the modal for adding a new item.
   */
  const handleCloseAddItem = () => {
    setShowAddItem(false);
  };

 
  // Redux state for items
  const { items, loading, error, success, itemsCache } = useSelector(
    (state) => state.items
  );

  /**
   * Fetches the list of items from the server.
   * Runs whenever `id`, `subId`, `page`, `success`, or `refresh` changes.
   */
  useEffect(() => {
    const getItems = async () => {
      await dispatch(getAllItemsAction({ id, subId, page }));
    };

    getItems();
    window.scrollTo(0, 0); // Ensure scroll to top on page load or data change
  }, [dispatch, id, subId, page, success, refresh]);

  return (
    <Fragment>
     

      <SubAppBar
        title=" العناصر "
        showAddButton={true}
        onAdd={handleShowAddItem}
        showRefreshButton={true}
        setRefresh={setRefresh}
        requiredPermission={{ Add: PermissionsEnum.ORDER_ADD }}
      />

      <ItemsContainer
        items={items}
        loading={loading}
        setPage={setPage}
        page={page}
        masterId={id}
      />

      <ModalAddItem
        show={showAddItem}
        handleShow={handleShowAddItem}
        handleClose={handleCloseAddItem}
        page={page}
        masterId={id}
        subId={subId}
      />

      <ToastContainer />
    </Fragment>
  );
};

export default ItemsPage;
