/**
 * File: helpers.js
 * Description:
 *   - Provides helper functions for managing advertisement forms and actions.
 *   - Includes logic for building form fields, handling form submissions (add/edit),
 *     and deleting advertisements with notifications.
 */

import {
  addNewAdvAction,
  deleteAdvAction,
  getAllAdsAction,
  resetAdvState,
  resetDeletedAdv,
  resetUpdatedAdv,
  updateAdvAction,
} from "../../../redux/slice/ads/adsSlice";

import notify from "../../../utils/useNotification";

/**
 * Generates dynamic form fields for the advertisement form.
 * Handles validation such as required fields and date restrictions.
 * @returns {Array<Object>} Array of field definitions
 */
export const getAdvFormField = () => {
  const fields = [
    {
      name: "image",
      label: "إختر صورة",
      type: "image",
      requierd: true,
      width: "300px",
      height: "200px",
    },
    { name: "title", label: "الإسم", type: "text", required: true, dir: "rtl" },
    {
      name: "from_date",
      label: "تاريخ البداية",
      type: "date",
      required: true,
      inputProps: (value) => {
        return { min: new Date().toISOString().split("T")[0] };
      },
    },
    {
      name: "to_date",
      label: "تاريخ النهاية",
      type: "date",
      required: true,
      inputProps: (value) => {
        if (!value["from_date"] || isNaN(Date.parse(value["from_date"]))) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return { min: tomorrow.toISOString().split("T")[0] };
        }
        const fromDate = new Date(value["from_date"]);
        const minDate = new Date(fromDate.setDate(fromDate.getDate() + 1));
        return { min: minDate.toISOString().split("T")[0] };
      },
    },
    {
      name: "is_panorama",
      label: "Panorama",
      type: "select",
      required: true,
      options: ["نعم", "لا"],
    },
    {
      name: "hide_date",
      label: "إخفاء التاريخ",
      type: "select",
      required: true,
      dir: "rtl",
      options: ["نعم", "لا"],
    },
  ];
  return fields;
};

/**
 * Handles the submission of the advertisement form.
 * Supports both add and edit modes, and dispatches relevant Redux actions.
 *
 * @param {'add'|'edit'} mode - Indicates the form mode.
 * @param {Object} values - Form values.
 * @param {number} id - Advertisement ID (required in edit mode).
 * @param {Function} dispatch - Redux dispatch function.
 * @param {number} page - Current pagination page.
 */
export const handleSubmitForm = async (mode, values, id, dispatch, page) => {
  const is_panorama = values?.is_panorama === "لا" ? 0 : 1;
  const hide_date = values?.hide_date === "لا" ? 0 : 1;

  const body = {
    ...values,
    ...(mode === "edit" && { id }),
    is_panorama,
    hide_date,
  };


  if (mode === "edit" && typeof(body?.image) === 'string') {
    delete body.image;
  }

  const action =
    mode === "edit"
      ? updateAdvAction({ data: body })
      : addNewAdvAction(body);

  try {
    const result = await dispatch(action);
    if (result?.payload.status === true) {
      notify(
        mode === "edit" ? "تم التحديث بنجاح" : "تم الإضافة بنجاح",
        "success"
      );
      await dispatch(getAllAdsAction(page));
    } else {
      notify("فشلت العملية", "error");
    }
  } catch (error) {
    console.error("Submission error:", error);
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    if (mode === "edit") {
      await dispatch(resetUpdatedAdv());
    } else {
      await dispatch(resetAdvState());
    }
  }
};

/**
 * Handles deletion of an advertisement by ID.
 *
 * @param {number} id - Advertisement ID to delete.
 * @param {Function} dispatch - Redux dispatch function.
 * @param {number} page - Current pagination page.
 * @param {Function} handleClose - Function to close the modal after deletion.
 */
export const handleDelete = async (id, dispatch, page, handleClose) => {
  try {
    const response = await dispatch(deleteAdvAction(id));
    if (response.payload.status === true) {
      notify("تم الحذف بنجاح", "success");
      handleClose();
      await dispatch(getAllAdsAction(page));
    } else {
      notify("فشلت عملية الحذف", "error");
    }
  } catch (error) {
    console.error("Delete error", error);
    notify(error?.message || "حدث خطأ ما", "error");
  } finally {
    await dispatch(resetDeletedAdv());
  }
};
