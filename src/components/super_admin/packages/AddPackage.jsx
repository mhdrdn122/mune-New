import { Box, Button, TextField } from "@mui/material";
import { Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {} from "../../../redux/slice/categories/categoriesSlice";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import { useAddNewPackageMutation } from "../../../redux/slice/super_admin/packages/packagesApi";
import useError401 from "../../../hooks/useError401 ";

const AddPackage = ({ show, handleClose }) => {
  const [addNewPackage, { isLoading, isSuccess, isError, error }] =
    useAddNewPackageMutation();

  const { triggerRedirect } = useError401(isError, error);
  console.log(isSuccess);
  console.log(isError);
  console.log(error);

  const formik = useFormik({
    initialValues: {
      title_en: "",
      title_ar: "",
      price: 0,
      value: "",
    },
    onSubmit: async (values, { setErrors }) => {
      console.log(JSON.stringify(values));
      try {
        const result = await addNewPackage(values).unwrap();
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
        } else {
          notify(error.data.message, "error");
          const backendErrors = error.data.errors;
          const formattedErrors = {};
          for (const key in backendErrors) {
            formattedErrors[key] = backendErrors[key][0];
          }
          console.log(formattedErrors);
          setErrors(formattedErrors);
        }
      }
    },
    validationSchema: Yup.object({
      title_en: Yup.string().required("Required"),
      title_ar: Yup.string().required("Required"),
      price: Yup.number().required("Required"),
      value: Yup.number().required("Required"),
    }),
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>إضافة حزمة </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <TextField
            margin="dense"
            id="title_ar"
            name="title_ar"
            label="الاسم باللغة العربية"
            type="text"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title_ar}
            error={!!formik.touched.title_ar && !!formik.errors.title_ar}
            helperText={formik.touched.title_ar && formik.errors.title_ar}
            dir="rtl"
          />
          <TextField
            margin="dense"
            id="title_en"
            name="title_en"
            label="الاسم باللغة الثانوية"
            type="text"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title_en}
            error={!!formik.touched.title_en && !!formik.errors.title_en}
            helperText={formik.touched.title_en && formik.errors.title_en}
          />
          <TextField
            margin="dense"
            id="price"
            name="price"
            label="السعر"
            type="number"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
            error={!!formik.touched.price && !!formik.errors.price}
            helperText={formik.touched.price && formik.errors.price}
          />
          <TextField
            margin="dense"
            id="value"
            name="value"
            label="الأيام"
            type="number"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.value}
            error={!!formik.touched.value && !!formik.errors.value}
            helperText={formik.touched.value && formik.errors.value}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            className="mx-2"
            onClick={() => {
              handleClose();
              formik.resetForm();
            }}
          >
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

export default AddPackage;
