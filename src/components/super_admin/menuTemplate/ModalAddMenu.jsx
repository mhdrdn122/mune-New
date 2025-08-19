import { Box, Button, TextField } from "@mui/material";
import { Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {} from "../../../redux/slice/categories/categoriesSlice";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import { useAddNewMenuMutation } from "../../../redux/slice/super_admin/menu/menusApi";
import useError401 from "../../../hooks/useError401 ";

const ModalAddMenu = ({ show, handleClose }) => {
  const [addNewMenu, { isLoading, isSuccess, isError, error }] =
    useAddNewMenuMutation();
  const { triggerRedirect } = useError401(isError, error);

  console.log(isSuccess);
  console.log(isError);
  console.log(error);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: async (values, { setErrors }) => {
      console.log(JSON.stringify(values));
      try {
        const result = await addNewMenu(values).unwrap();
        console.log("Service added successfully:", result);
        if (result.status === true) {
          notify(result.message, "success");
          handleClose();
          formik.resetForm();
        } else {
          console.log(result.message);
          const errors = {};
          Object.keys(result.message).forEach((key) => {
            const formattedKey = key.split(".").join("_");
            errors[formattedKey] = result.message[key][0];
          });
          console.log(errors);
          const errorMessages = Object.values(errors).join(", ");
          notify(errorMessages, "warn");
        }
      } catch (error) {
        console.error("Failed to add service:", error);
        if (error.status === "FETCH_ERROR") {
          notify("No Internet Connection", "error");
        } else if (error?.status === 401) {
          triggerRedirect();
        } else {
          // notify(error.data.message, "error");
          // const formattedErrors = {};
          // for (const key in backendErrors) {
          //   formattedErrors[key] = backendErrors[key][0];
          // }
          // console.log(backendErrors);
          // console.log(formattedErrors);
          const backendErrors = error.data.errors || {};
          setErrors(backendErrors);
        }
      }
    },
    validationSchema: Yup.object({
      name: Yup.string()
      .min(4, "لا يمكن أن يحتوي حقل الاسم على نص طوله أقل من 4 محرف")
      .required("الاسم مطلوب"),
    }),
  });

  useEffect(()=>{
    formik.resetForm();
  },[handleClose])

  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>إضافة قائمة</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <TextField
            margin="dense"
            sx={{ width: "50%" }}
            id="name"
            name="name"
            label="الاسم"
            type="text"
            fullWidth
            variant="outlined"
            focused
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            error={!!formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
            dir="rtl"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" className="mx-2" onClick={handleClose}>
            تجاهل
          </Button>

          {isLoading === true ? (
            <Button variant="contained" className="">
              <Spinner
                className="m-auto"
                animation="border"
                role="status"
              ></Spinner>
            </Button>
          ) : (
            <Button
              variant="contained"
              type="submit"
              className=""
              onClick={() => {}}
            >
              حفظ
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalAddMenu;
