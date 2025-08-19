import notify from "../../utils/useNotification";

export const getAddServiceFormFields = ()=>{
    const fields = [
        { name: "name_ar", label: "الاسم باللغة العربية", type: "text", required: true },
        { name: "name_en", label: "الاسم باللغة الثانوية", type: "text", required: true },
        { name: "price", label: "السعر", type: "number", required: true},
    ]
    return fields;
}

export const handleAddService = async (values,handleClose,addService) => {
    try {
        const result = await addService(values).unwrap();
        if (result.status === true) {
            notify(result.message, "success");
            handleClose();
        }
    } catch (error) {
        if (error.status === "FETCH_ERROR") {
            notify("No Internet Connection", "error");
        } else {
            notify(error.data.message, "error");
        }
    }
}
export const handleUpdateService = async (values, handleClose,updateService) => {
    
    try {
        
        const result = await updateService(values).unwrap();
        if (result.status === true) {
            notify(result.message, "success");
            handleClose();
        }
    } catch (error) {
        if (error.status === "FETCH_ERROR") {
            notify("No Internet Connection", "error");
        } else {
            notify(error.data.message, "error");
        }
    }
}

export const handleDeleteService = async (id,deleteService,handleClose,triggerRedirect) => {
    try {
        const result = await deleteService(id).unwrap();
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
