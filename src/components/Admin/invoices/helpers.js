import axios from "axios";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
import notify from "../../../utils/useNotification";

/**
 * Handle paying an invoice using mutation.
 *
 * @param {Function} payInvoice - Redux Toolkit mutation function for paying an invoice.
 * @param {number} id - ID of the invoice to be paid.
 * @param {Function} handleCloseEdit - Callback to close the pay modal.
 * @param {Function} triggerRedirect - Callback to redirect on 401 Unauthorized error.
 */
export const handlePay = async (payInvoice, id, handleCloseEdit, triggerRedirect) => {
    try {
        const result = await payInvoice(id).unwrap();
        if (result.status === true) {
            notify(result.message, "success");
            handleCloseEdit();
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
 * Handle receiving an invoice (mark as received).
 *
 * @param {number} id - ID of the invoice.
 * @param {Function} setLoadingReceive - Function to toggle loading state.
 * @param {Function} handleClose - Callback to close the receive modal.
 * @param {Object} adminInfo - Admin information containing a JWT token.
 */
export const handleReceive = async (id, setLoadingReceive, handleClose, adminInfo) => {
    const url = `${baseURLLocalPublic}/admin_api/update_status_invoice_received?id=${id}`;
    setLoadingReceive(true);
    try {
        let response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${adminInfo.token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            response = await response.json();
            setTimeout(() => {
                notify(response.message, "error");
            }, 200);
            return;
        }

        const result = await response.json();
        notify(result.message, "success");
        handleClose();
    } catch (error) {
        console.log("Error while updating invoice:", error);
        notify(error?.message, "error");
    } finally {
        setLoadingReceive(false);
    }
};

/**
 * Generate form fields to add a service.
 *
 * @param {Array} services - List of services (each having a `name` field).
 * @returns {Array} Form fields for dynamic form.
 */
export const getServiceFormField = (services) => {
    const options = services?.map((service) => service?.name);
    return [
        { name: "service_id", label: "الخدمة", type: "select", required: true, options },
        { name: "count", label: "الكمية", type: "number", required: true },
    ];
};

/**
 * Submit new service to invoice.
 *
 * @param {Object} values - Form values.
 * @param {Array} services - List of available services.
 * @param {number} invoice_id - Invoice ID to add the service to.
 * @param {Function} handleClose - Callback to close modal.
 * @param {Object} userData - Admin user data with token.
 */
export const onAddServiceSubmit = async (values, services, invoice_id, handleClose, userData) => {
    const service_id = services?.data?.find(item => item.name === values.service_id)?.id;
    const body = {
        service_id,
        count: values.count,
        invoice_id
    };

    try {
        const result = await axios.post(`${baseURLLocalPublic}/admin_api/add_service_to_order`, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        });

        if (result.status === 200) {
            notify(result.data.message, "success");
            handleClose();
        }
    } catch (error) {
        if (error.status === "FETCH_ERROR") {
            notify("No Internet Connection", "error");
        } else {
            notify(error.response?.data?.message, "error");
            const backendErrors = error.response?.data?.errors;
            const formattedErrors = {};
            for (const key in backendErrors) {
                formattedErrors[key] = backendErrors[key][0];
            }
        }
    } finally {
        // Should not call UI hook inside utility file; caller should manage state.
        // setShowAddService(false); <- This line was incorrect and is removed.
    }
};

/**
 * Generate form fields to add a new invoice.
 *
 * @param {Array} tables - List of tables (each having `number_table`).
 * @returns {Array} Form fields for dynamic form.
 */
export const getAddInvoiceFormFields = (tables) => {
    const tableNumbers = tables?.map((table) => table.number_table);
    return [
        { name: "table_id", label: "الطاولة", type: "select", required: true, options: tableNumbers },
    ];
};

/**
 * Submit a new invoice.
 *
 * @param {Object} values - Form values (from dynamic form).
 * @param {Function} addInvoice - Redux mutation function to add invoice.
 * @param {Function} handleClose - Callback to close modal.
 * @param {Array} tables - List of tables to resolve table_id.
 */
export const onAddInvoiceSubmit = async (values, addInvoice, handleClose, tables) => {
    const table_id = tables?.find(item => item.number_table === values.table_id)?.id;
    try {
        const result = await addInvoice({ table_id }).unwrap();
        if (result.status === true) {
            notify(result.message, "success");
            handleClose();
        }
    } catch (error) {
        console.error("Failed to add service:", error);
        if (error.status === "FETCH_ERROR") {
            notify("No Internet Connection", "error");
        } else {
            notify(error.data?.message, "error");
            const backendErrors = error.data?.errors;
            const formattedErrors = {};
            for (const key in backendErrors) {
                formattedErrors[key] = backendErrors[key][0];
            }
            console.log(formattedErrors);
        }
    }
};
