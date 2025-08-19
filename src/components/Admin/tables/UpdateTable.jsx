import { Button, createTheme, FormControl, FormHelperText, Grid, InputLabel, 
  TextField, ThemeProvider, useTheme } from "@mui/material";
import { Select, MenuItem } from "@mui/material";

import { Modal, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {} from "../../../redux/slice/categories/categoriesSlice";
import notify from "../../../utils/useNotification";
import { useUpdateTableMutation } from "../../../redux/slice/tables/tablesApi";
import useError401Admin from "../../../hooks/useError401Admin";
import ButtonWithLoading from "../../../utils/ButtonWithLoading";

const UpdateTable = ({ show, handleClose }) => {
  
  const [updateTable, { isLoading: loading, isError, error }] =
    useUpdateTableMutation();

  const { triggerRedirect } = useError401Admin(isError, error);

  const formik = useFormik({
    initialValues: {
      id: show.id,
      number_table: show.number_table,
      is_qr_table:show.is_qr_table,
    },
    enableReinitialize: true,
    onSubmit: async (values, { setErrors }) => {
      // console.log(JSON.stringify(values));
      try {
        const result = await updateTable(values).unwrap();
        console.log("Service added successfully:", result);
        if (result.status === true) {
          notify(result.message, "success");
          handleClose();
          formik.resetForm();
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
      number_table: Yup.string().required("Required"),
    }),
  });
  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>تعديل طاولة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            margin="dense"
            id="number_table"
            name="number_table"
            label="رقم الطاولة"
            type="text"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.number_table}
            error={
              !!formik.touched.number_table && !!formik.errors.number_table
            }
            helperText={
              formik.touched.number_table && formik.errors.number_table
            }
            dir="rtl"
          />
                        <FormControl
              variant="outlined"
              fullWidth
              size="medium"
              error={
                !!formik.touched.is_qr_table && !!formik.errors.is_qr_table
              }
                >
          <InputLabel id="is_qr_table">إلى هذه الطاولة qr  هل تريد إضافة </InputLabel>
            <Select
                id="is_qr_table"
                name="is_qr_table"
                label="إلى هذه الطاولة qr  هل تريد إضافة "
                value={formik.values.is_qr_table}
                defaultValue={show.is_qr_table}
                onChange={formik.handleChange}
                fullWidth
                error={
                  !!formik.touched.is_qr_table && !!formik.errors.is_qr_table
                }
                helperText={
                  formik.touched.is_qr_table && formik.errors.is_qr_table
                }>
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
          </Select>
          {formik.touched.is_qr_table && formik.errors.is_qr_table && (
                        <FormHelperText>
                          {formik.errors.is_qr_table}
                        </FormHelperText>
                      )}

          </FormControl>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" className="mx-2" onClick={handleClose}>
            تجاهل
          </Button>

          <ButtonWithLoading loading={loading} text="حفظ" />

        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default UpdateTable;
