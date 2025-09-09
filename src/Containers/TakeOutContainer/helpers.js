import axios from "axios";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import notify from "../../utils/useNotification";

/**
 * Generates form fields for editing a takeout order.
 *
 * @param {Array} drivers - List of drivers from the server.
 * @returns {Array} - Array of field definitions for DynamicForm.
 */
export const getEditFields = (drivers) => {
  const options = drivers.map((driver) => driver.name);

  const fields = [
    {
      name: "driver",
      label: "السائق",
      type: "select",
      options: options,
      required: true,
      dit: "rtl",
    //  isHidden: (values) => values.status !== "Waiting"  
    },
    {
      name: "status",
      label: "الحالة",
      type: "select",
      required: true,
      dit: "rtl",
      options: [
        "Rejected",
        "Approved",
        "Processing",
      ],
    },
  ];
  return fields;
};

/**
 * Handles the logic to update the order by assigning a driver and updating status.
 *
 * @param {Object} values - Form values submitted.
 * @param {Array} drivers - List of available drivers.
 * @param {Object} adminInfo - Admin credentials from local storage.
 * @param {Function} setRefresh - Function to trigger a data refresh.
 * @param {Function} handleClose - Function to close the modal.
 * @param {Object} passedData - Original order data being updated.
 */
export const handleUpdateOrder = async (
  values,
  drivers,
  adminInfo,
  setRefresh,
  handleClose,
  passedData
) => {
  console.log("test")
  const driverId = drivers.find((driver) => driver.name === values["driver"])?.id;
 console.log(passedData)
  try {
    const body = {
      delivery_id: driverId,
      delivery_price: passedData?.delivery_price,
      invoice_id: passedData?.id,
    };

    const changStatus = {
      id: passedData?.id,
      status: values["status"],
    };

    let result;
    if (driverId) {
      result = await axios.post(
        `${baseURLLocalPublic}/admin_api/give_order_to_delivery`,
        body,
        {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
          },
        }
      );
    }
    let statusResult;
    if(values["status"]){
      statusResult = await axios.post(
      `${baseURLLocalPublic}/admin_api/update_takeout`,
      changStatus,
      {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      }
    );
    }
    console.log(statusResult,'result')

    notify(result?.data?.message || statusResult?.data?.message, "success");
    handleClose();
    setRefresh((prev) => prev + 1);
  } catch (error) {
    console.error("Update order error:", error);
    notify(error?.response?.data?.message || "Update failed", "error");
  }
};

/**
 * Marks an invoice as received by calling a backend API.
 *
 * @param {number} invoiceId - ID of the invoice to update.
 * @param {Function} setLoadingReceivedItemId - Setter to control loading state per item.
 * @param {Object} adminInfo - Admin credentials from local storage.
 */
export const handleReceive = async (invoiceId, setLoadingReceivedItemId, adminInfo) => {
  const url = `${baseURLLocalPublic}/admin_api/update_status_invoice_paid?id=${invoiceId}`;
  notify("جاري القيام بالعملية", "success");

  try {
    let response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      setTimeout(() => {
        notify(errorData.message, "error");
      }, 200);
      return;
    }

    const result = await response.json();
    console.log("Invoice updated successfully:", result);
    notify(result.message, "success");
  } catch (error) {
    console.error("Error while updating invoice:", error);
    notify("حدث خطأ أثناء تحديث الفاتورة", "error");
  } finally {
    setLoadingReceivedItemId(null);
  }
};
