import notify from "../../../utils/useNotification";

/**
 * Returns the form configuration for creating or editing a driver.
 * @returns {Array<Object>} An array of field configuration objects for the driver form.
 */
export const getDriverFormFields = () => {
  const fields = [
    { name: "image", label: "إختر صورة", type: "image", width: "300px", height: "200px" },
    { name: "name", label: "الإسم", type: "text", required: true, dir: "rtl" },
    { name: "password", label: "كلمة المرور", type: "password", required: true },
    { name: "username", label: "اسم المستخدم", type: "text", required: true },
    { name: "phone", label: "رقم الموبايل", type: "text", required: true },
    {
      name: "birthday",
      label: "تاريخ البداية",
      type: "date",
      required: true,
      inputProps: () => {
        const fromDate = new Date();
        const maxDate = new Date(fromDate.setDate(fromDate.getDate() - 18 * 365));
        return { max: maxDate.toISOString().split("T")[0] };
      },
    },
  ];
  return fields;
};

/**
 * Handles the submission logic for creating a new delivery driver.
 * 
 * @param {Object} values - The form values entered by the user.
 * @param {Function} addNewDelivery - RTK Query mutation function for creating a new driver.
 * @param {Function} triggerRedirect - Callback to redirect on unauthorized access (401).
 * @param {Object} errorAdd - Error object from RTK Query for error handling.
 * @returns {Promise<void>}
 */
export const handleAddDriverSubmit = async (values, addNewDelivery, triggerRedirect, errorAdd) => {
  const restaurant_id = JSON.parse(localStorage.getItem("adminInfo")).restaurant_id;
  const formData = new FormData();

  for (const key in values) {
    formData.append(key, values[key]);
  }

  formData.append("restaurant_id", restaurant_id);

  try {
    const result = await addNewDelivery(formData).unwrap();

    if (!result.status === true) {
      if (errorAdd.status === "FETCH_ERROR") {
        notify("No Internet Connection", "error");
      } else if (errorAdd.status === 401) {
        triggerRedirect();
      } else {
        notify(errorAdd?.data?.message, "error");
      }
    }
  } catch (error) {
    notify("فشلت العملية");
  }
};

/**
 * Deletes a driver by ID and closes the modal on success.
 * 
 * @param {number|string} id - The ID of the driver to delete.
 * @param {Function} deleteDelivery - RTK Query mutation function for deleting the driver.
 * @param {Function} handleClose - Function to close the confirmation modal.
 * @param {Function} triggerRedirect - Callback to redirect on unauthorized access (401).
 * @returns {Promise<void>}
 */
export const handleDelete = async (id, deleteDelivery, handleClose, triggerRedirect) => {
  try {
    const result = await deleteDelivery(id).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleClose();
    } else {
      notify(result.message, "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      triggerRedirect();
    } else {
      console.error("Failed:", error);
      notify(error?.data?.message, "error");
    }
  }
};

/**
 * Toggles activation status of a driver (active/inactive).
 * 
 * @param {number|string} id - The ID of the driver to activate/deactivate.
 * @param {Function} deactivateDelivery - RTK Query mutation function to toggle driver status.
 * @param {Function} handleClose - Function to close the modal after completion.
 * @param {Function} triggerRedirect - Callback to redirect on unauthorized access (401).
 * @returns {Promise<void>}
 */
export const handleDeactive = async (id, deactivateDelivery, handleClose, triggerRedirect) => {
  try {
    const result = await deactivateDelivery(id).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleClose();
    } else {
      notify(result.message, "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      triggerRedirect();
    } else {
      notify(error?.data?.message, "error");
    }
  }
};

/**
 * Handles updating a driver's details.
 * 
 * @param {Object} values - Updated form values.
 * @param {number|string} id - The ID of the driver being edited.
 * @param {Function} updateDelivery - RTK Query mutation function to update the driver.
 * @param {Function} handleClose - Function to close the modal after updating.
 * @param {Function} triggerRedirect - Callback to redirect on unauthorized access (401).
 * @returns {Promise<void>}
 */
export const handleUpdateDriverSubmit = async (
  values,
  id,
  updateDelivery,
  handleClose,
  triggerRedirect
) => {
  if (values.image === "") delete values.image;
  if (values.password === "") delete values.password;

  const restaurant_id = JSON.parse(localStorage.getItem("adminInfo")).restaurant_id;
  const formData = new FormData();

  for (const key in values) {
    formData.append(key, values[key]);
  }

  formData.append("id", id);
  formData.append("restaurant_id", restaurant_id);

  try {
    const result = await updateDelivery(formData).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleClose();
    }
  } catch (error) {
    if (error.status === 401) {
      triggerRedirect();
    } else {
      notify(error?.data?.message, "error");
    }
  }
};
