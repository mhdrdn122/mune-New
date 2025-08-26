import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {} from "../../../redux/slice/categories/categoriesSlice";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
// import { getAllCitiesAction } from "../../../redux/slice/super_admin/city/citySlice";
import { useParams } from "react-router-dom";
// import { useAddRestAdminMutation } from "../../../redux/slice/super_admin/resAdmins/resAdminsApi";
import { useUpdateRestManagerMutation } from "../../../redux/slice/super_admin/restManagers/restManagerApi";
import useError401 from "../../../hooks/useError401 ";

const EditResManager = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { resId } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [
    updateRestManager,
    { isLoading: isLoadingAdd, isSuccess, isError, error: errorAdd },
  ] = useUpdateRestManagerMutation();

  const { triggerRedirect } = useError401(isError, errorAdd);

  const formik = useFormik({
    initialValues: {
      name: show?.name,
      user_name: show?.user_name,
      email:show?.email,
      password: "",
      mobile: show?.mobile,
      id: show?.id,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(JSON.stringify(values));
      if (values.password === "") {
        delete values.password;
      }
      const result = await updateRestManager(values).unwrap();
      console.log(result);
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      user_name: Yup.string().required("Required"),
      // password: Yup.string().required("Required"),
      mobile: Yup.number().typeError(" يجب ان يكون رقم").required("Required"),
    }),
  });

  useEffect(() => {
    if (!isLoadingAdd && isSuccess) {
      notify("Updated Successfully", "success");
      handleClose();
      formik.resetForm();
    }
  }, [isSuccess, isLoadingAdd]);

  useEffect(() => {
    if (isError) {
      console.error("Failed to add service:", errorAdd);
      if (errorAdd.status === "FETCH_ERROR") {
        notify("No Internet Connection", "error");
      } else {
        notify(errorAdd.data.message, "error");
        // const backendErrors = errorAdd.data.errors;
        // const formattedErrors = {};
        // for (const key in backendErrors) {
        //   formattedErrors[key] = backendErrors[key][0];
        // }
        // console.log(formattedErrors);
        // formik.setErrors(formattedErrors);
        formik.setErrors(errorAdd.data?.errors || {});
      }
    }
  }, [isError, errorAdd]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title> إضافة مدير للمطاعم</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box
            m="0 0 0 0"
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, 1fr)" // تعديل هنا لتكون 4 أعمدة
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              margin="dense"
              id="name"
              name="name"
              label="الاسم"
              type="text"
              fullWidth
              sx={{ gridColumn: "span 2" }}
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={!!formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
              dir="rtl"
            />
            <TextField
              margin="dense"
              id="user_name"
              name="user_name"
              label="اسم المستخدم"
              type="text"
              fullWidth
              sx={{ gridColumn: "span 2" }}
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user_name}
              error={!!formik.touched.user_name && !!formik.errors.user_name}
              helperText={formik.touched.user_name && formik.errors.user_name}
            />
            <TextField
                          margin="dense"
                          id="email"
                          name="email"
                          label="البريد الالكتروني "
                          type="text"
                          fullWidth
                          sx={{ gridColumn: "span 2" }}
                          variant="outlined"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          error={!!formik.touched.email && !!formik.errors.email}
                          helperText={formik.touched.email && formik.errors.email}
                        />
            <TextField
              margin="dense"
              id="password"
              name="password"
              label="كلمة السر"
              type="password"
              fullWidth
              sx={{ gridColumn: "span 2" }}
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={!!formik.touched.password && !!formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />

            <TextField
              margin="dense"
              id="mobile"
              name="mobile"
              label="رقم الموبايل"
              type="text"
              fullWidth
              sx={{ gridColumn: "span 2" }}
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobile}
              error={!!formik.touched.mobile && !!formik.errors.mobile}
              helperText={formik.touched.mobile && formik.errors.mobile}
              dir="rtl"
            />
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" className="mx-2" onClick={handleClose}>
            تجاهل
          </Button>

          {isLoadingAdd === true ? (
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

export default EditResManager;
