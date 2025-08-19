import {
  deactiveItemAction,
  deleteItemAction,
  getAllItemsAction,
  resetDeletedItem,
  resetDeactiveItem, // Make sure this is actually imported if used
} from "../../../redux/slice/items/itemsSlice";
import notify from "../../../utils/useNotification";

/**
 * handleDelete
 * Deletes an item by dispatching a Redux action and refreshes the items list.
 * 
 * @param {number|string} id - The ID of the item to delete.
 * @param {Function} dispatch - Redux dispatch function.
 * @param {number} page - Current page number for pagination.
 * @param {Function} handleClose - Function to close the modal or UI on success.
 * @param {number|string} parentSubCat - Sub-category ID.
 * @param {number|string} parentCategory - Main category ID.
 */
export const handleDelete = async (id, dispatch, page, handleClose, parentSubCat, parentCategory) => {
  let response;
  try {
    response = await dispatch(deleteItemAction({ id, parentCategory, parentSubCat }));
    console.log("response", response);

    const isSuccess =
      response.status === true ||
      response.status === 200 ||
      response.payload?.status === true;

    if (isSuccess) {
      notify("تم الحذف بنجاح", "success");
      handleClose();
      await dispatch(getAllItemsAction({ id: parentCategory, parentSubCat, page }));
    } else {
      notify("فشلت عملية الحذف", "error");
    }
  } catch (error) {
    console.error("Delete error", error);
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    await dispatch(resetDeletedItem());
  }
};

/**
 * handleDeactivate
 * Toggles activation status of an item and refreshes the item list.
 * 
 * @param {number|string} id - The ID of the item.
 * @param {Function} dispatch - Redux dispatch function.
 * @param {number} page - Current page number for pagination.
 * @param {Function} handleClose - Function to close modal or UI after success.
 * @param {number|string} parentSubCat - Sub-category ID.
 * @param {number|string} parentCategory - Main category ID.
 * @param {boolean|number} is_active - Indicates if the item is currently active.
 */
export const handleDeactivate = async (
  id,
  dispatch,
  page,
  handleClose,
  parentSubCat,
  parentCategory,
  is_active
) => {
  let response;
  try {
    response = await dispatch(deactiveItemAction({ id, parentCategory, parentSubCat }));

    if (response.payload?.status === true) {
      const message = is_active ? "تم إلغاء التنشيط بنجاح" : "تم التنشيط بنجاح";
      notify(message, "success");
      handleClose();
      await dispatch(getAllItemsAction({ id: parentCategory, parentSubCat, page }));
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    console.error("Deactivate error", error);
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    await dispatch(resetDeactiveItem());
  }
};
