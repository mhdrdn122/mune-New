import notify from "../../../utils/useNotification";

export const handleDelete = async (id,deleteUser,handleClose,triggerRedirect) => {
    try {
        const result = await deleteUser(id).unwrap();
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
export const handleDeactive = async (id,deactivateUser,handleClose,triggerRedirect) => {
    try {
        const result = await deactivateUser(id).unwrap();
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