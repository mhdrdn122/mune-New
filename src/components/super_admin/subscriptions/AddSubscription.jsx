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
import { getAllCitiesAction } from "../../../redux/slice/super_admin/city/citySlice";
import { useParams } from "react-router-dom";
import { useAddRestAdminMutation } from "../../../redux/slice/super_admin/resAdmins/resAdminsApi";
import { useGetPackagesQuery } from "../../../redux/slice/super_admin/packages/packagesApi";
import { useAddSubscriptionMutation } from "../../../redux/slice/super_admin/resturant/resturantsApi";
import useError401 from "../../../hooks/useError401 ";

const AddSubscription = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { resId } = useParams();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [
    addSubscription,
    { isLoading: isLoadingAdd, isSuccess, isError, error: errorAdd },
  ] = useAddSubscriptionMutation();

  const { triggerRedirect } = useError401(isError, errorAdd);
  const {
    data: packages,
    // isError,
    // error,
    // isLoading: loading,
  } = useGetPackagesQuery(1);

  const formik = useFormik({
    initialValues: {
      package_id: "",
      restaurant_id: resId,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(JSON.stringify(values));
      const result = await addSubscription({
        packId: values.package_id,
        resId: values.restaurant_id,
      }).unwrap();
      console.log(result);
    },
    validationSchema: Yup.object({
      package_id: Yup.string().required("Required"),
    }),
  });

  useEffect(() => {
    if (!isLoadingAdd && isSuccess) {
      notify("Created Successfully", "success");
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
          <Modal.Title> إضافة اشتراك</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            error={!!formik.touched.package_id && !!formik.errors.package_id}
            sx={{ my: "20px" }}
          >
            <InputLabel id="package_id">الحزمة</InputLabel>
            <Select
              InputLabelProps={{ shrink: true }}
              labelId="package_id"
              id="package_id"
              name="package_id"
              label="الحزمة"
              // size="small"
              value={formik.values.package_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {packages &&
                packages.data &&
                packages.data.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
            </Select>
            {formik.touched.package_id && formik.errors.package_id && (
              <FormHelperText>{formik.errors.package_id}</FormHelperText>
            )}
          </FormControl>
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

export default AddSubscription;
