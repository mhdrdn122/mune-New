/**
 * helpers.js
 *
 * This file defines all utility functions and form structure used in the CouponsContainer.
 * It includes:
 * - Form fields for coupon creation/editing
 * - Submit handlers for add/update/delete/deactivate operations
 * - Date validation logic
 */

import notify from "../../utils/useNotification";

/**
 * Returns form field definitions for creating/updating a coupon.
 * Includes:
 * - Code (text)
 * - Discount Percent (number)
 * - From Date (date)
 * - To Date (date with dynamic minimum based on from_date)
 */
export const getCouponFormFields = () => {
  const fields = [
    // { name: "code", label: "الكود", type: "text", required: true },
    { name: "percent", label: "الخصم", type: "number", required: true },
    {
      name: "from_date",
      label: "تاريخ البداية",
      type: "date",
      required: true,
      inputProps: (value) => {
        console.log('we are here');
        return { min: new Date().toISOString().split("T")[0] };
      },
    },
    {
      name: "to_date",
      label: "تاريخ النهاية",
      type: "date",
      required: true,
      inputProps: (value) => {
        if (!value['from_date'] || isNaN(Date.parse(value['from_date']))) {
          console.log('we are in tomorrow');
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          console.log(tomorrow.toISOString().split("T")[0]);
          return { min: tomorrow.toISOString().split("T")[0] };
        }

        const fromDate = new Date(value['from_date']);
        const minDate = new Date(fromDate.setDate(fromDate.getDate() + 1));
        return { min: minDate.toISOString().split("T")[0] };
      },
    },
  ];
  return fields;
};

/**
 * Deletes a coupon by ID using the deleteCoupon mutation.
 * Displays success or error notifications.
 */
export const handleDelete = async (id, handleCloseDelete, deleteCoupon) => {
  try {
    const result = await deleteCoupon(id).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleCloseDelete();
    } else {
      notify(result.message, "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      console.error('error 401');
    } else {
      console.error("Failed:", error);
      notify(error?.data?.message, "error");
    }
  }
};

/**
 * Submits the form data to add a new coupon.
 * Uses addNewCoupon mutation.
 */
export const onAddCouponSubmit = async (values, addNewCoupon, handleClose) => {
  try {
    const result = await addNewCoupon(values).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleClose();
    } else {
      notify(result.message, "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      console.error('error 401');
    } else {
      console.error("Failed:", error);
      notify(error?.data?.message, "error");
    }
  }
};

/**
 * Activates or deactivates a coupon.
 * Uses deactivateCoupon mutation and shows appropriate notification.
 */
export const handleDeactive = async (id, deactivateCoupon, handleClose) => {
  try {
    const result = await deactivateCoupon(id).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleClose();
    } else {
      notify(result.message, "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      console.error('error 401');
    } else {
      console.error("Failed:", error);
      notify(error?.data?.message, "error");
    }
  }
};

/**
 * Submits updated coupon data.
 * Uses updateCoupon mutation with the passed ID and form values.
 */
export const onUdateCouponSubmit = async (values, updateCoupon, handleClose, id) => {
  const body = {
    ...values,
    id: id
  };
  try {
    const result = await updateCoupon(body).unwrap();
    if (result.status === true) {
      notify(result.message, "success");
      handleClose();
    } else {
      notify(result.message, "error");
    }
  } catch (error) {
    if (error?.status === 401) {
      console.error('error 401');
    } else {
      console.error("Failed:", error);
      notify(error?.data?.message, "error");
    }
  }
};
