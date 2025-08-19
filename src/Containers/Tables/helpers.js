import notify from "../../utils/useNotification";

export const getAddTableFormFields = () =>{
    const options = ['نعم','لا']
    const  addEmployeeFields = [
        { name: "number_table", label: "رقم الطاولة", type: "text", required: true },
        { name: "is_qr_table", label: "هل تريد إضافة QR الى هذه الطاولة", type: "select", required: true,options:options},
    ];
    return addEmployeeFields;
}

export const handleDelete = async (deleteTable,id,handleClose,triggerRedirect) => {
    try {
        const result = await deleteTable(id).unwrap();
        if (result.status === true) {
            notify(result.message, "success");
            handleClose()
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

export const onAddTableSubmit = async (values,addTable,handleCloasAddTable) => {
    try {
        values['is_qr_table'] === 'لا' ? values['is_qr_table'] = 0 : values['is_qr_table'] = 1
        const result = await addTable(values).unwrap();
        if (result.status === true) {
            notify(result.message, "success");
            handleCloasAddTable();
        }
    } catch (error) {
        if (error.status === "FETCH_ERROR") {
            notify("No Internet Connection", "error");
        } else {
                notify(error.data.message, "error");
                const backendErrors = error.data.errors;
                const formattedErrors = {};
            for (const key in backendErrors) {
                formattedErrors[key] = backendErrors[key][0];
            }
        }
    }
}

export const onUpdateTableSubmit = async (values,id,updateTable,handleClose) => {
    const body = {
        number_table:values['number_table'],
        is_qr_table:values['is_qr_table']==='لا'?0:1,
        id:id
    }
    try {
        const result = await updateTable(body).unwrap();
        if (result.status === true) {
            notify(result.message, "success");
            handleClose();
        }
    } catch (error) {
        if (error.status === "FETCH_ERROR") {
            notify("No Internet Connection", "error");
        } else {
            notify(error.data.message, "error");
            const backendErrors = error.data.errors;
            const formattedErrors = {};
            for (const key in backendErrors) {
            formattedErrors[key] = backendErrors[key][0];
            }
            console.log(formattedErrors);
        }
    }
}