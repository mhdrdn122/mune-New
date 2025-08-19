/**
 * This helper module provides utility functions and form configuration for managing city-related
 * operations such as create, update, delete, and activation/deactivation.
 * It interacts with the Redux city slice and handles toast notifications.
 */

import {
  addNewCityAction,
  deactiveCityAction,
  deleteCityAction,
  getAllCitiesAction,
  resetAddCity,
  resetDeletedCity,
  resetUpdatedCity,
  updateCityAction,
} from "../../redux/slice/super_admin/city/citySlice";
import notify from "../../utils/useNotification";

/**
 * Returns an array of form fields used for the "Add City" or "Edit City" modal.
 *
 * @returns {Array<Object>} Array of field definitions with name, label, type, and required flag
 */
export const getAddCityFormFields = () => {
  const fields = [
    { name: "name_ar", label: "الاسم باللغة العربية", type: "text", required: true },
    { name: "name_en", label: "الاسم باللغة الثانوية", type: "text", required: true },
  ];
  return fields;
};

/**
 * Submits a request to add a new city.
 *
 * @param {Object} values - Form values (e.g., name_ar, name_en)
 * @param {Function} dispatch - Redux dispatch function
 * @param {number} page - Current page for re-fetching cities
 * @param {Function} handleClose - Function to close the modal
 * @returns {Promise<void>}
 */
export const handleAddCitySubmit = async (values, dispatch, page, handleClose) => {
  try {
    const result = await dispatch(addNewCityAction(values));
    if (result?.payload?.status === true) {
      notify("تم الإضافة بنجاح", "success");
      await dispatch(getAllCitiesAction(page));
      handleClose();
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    await dispatch(resetAddCity());
  }
};

/**
 * Submits a request to update an existing city.
 *
 * @param {number} id - ID of the city to update
 * @param {Object} values - Updated form values
 * @param {Function} dispatch - Redux dispatch function
 * @param {number} page - Current page for re-fetching cities
 * @param {Function} handleClose - Function to close the modal
 * @returns {Promise<void>}
 */
export const handleUpdateCitySubmit = async (id, values, dispatch, page, handleClose) => {
  try {
    const result = await dispatch(updateCityAction({ ...values, id }));
    if (result?.payload?.status === true) {
      notify("تم التعديل بنجاح", "success");
      await dispatch(getAllCitiesAction(page));
      handleClose();
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    await dispatch(resetUpdatedCity());
  }
};

/**
 * Submits a request to delete a city.
 *
 * @param {number} id - ID of the city to delete
 * @param {Function} dispatch - Redux dispatch function
 * @param {number} page - Current page for re-fetching cities
 * @param {Function} handleClose - Function to close the modal
 * @returns {Promise<void>}
 */
export const handleDeleteCity = async (id, dispatch, page, handleClose) => {
  try {
    const result = await dispatch(deleteCityAction(id));
    if (result?.payload?.status === true) {
      notify("تم الحذف بنجاح", "success");
      await dispatch(getAllCitiesAction(page));
      handleClose();
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    await dispatch(resetDeletedCity());
  }
};

/**
 * Submits a request to activate or deactivate a city.
 *
 * @param {number} id - ID of the city to toggle activation
 * @param {Function} dispatch - Redux dispatch function
 * @param {number} page - Current page for re-fetching cities
 * @param {Function} handleClose - Function to close the modal
 * @param {number} is_active - Current activation status (1 = active, 0 = inactive)
 * @returns {Promise<void>}
 */
export const handleDeactiveCity = async (id, dispatch, page, handleClose, is_active) => {
  try {
    const result = await dispatch(deactiveCityAction(id));
    if (result?.payload?.status === true) {
      notify(is_active === 1 ? "تم التعطيل بنجاح" : "تم التنشيط بنجاح", "success");
      await dispatch(getAllCitiesAction(page));
      handleClose();
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    await dispatch(resetDeletedCity());
  }
};
