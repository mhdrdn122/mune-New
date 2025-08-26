import { Button, createTheme, FormControl, FormHelperText, Grid, InputLabel, 
  TextField, ThemeProvider, useTheme } from "@mui/material";
import { Select, MenuItem } from "@mui/material";

import { Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {} from "../../../redux/slice/categories/categoriesSlice";
import notify from "../../../utils/useNotification";
import { useAddTableMutation } from "../../../redux/slice/tables/tablesApi";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import ButtonWithLoading from "../../../utils/ButtonWithLoading";
import useError401Admin from "../../../hooks/useError401Admin";

const AddTable = ({ show, handleClose }) => {
  const [addTable, { isLoading,isError, error }] = useAddTableMutation();

  const { triggerRedirect } = useError401Admin(isError, error);

  const formik = useFormik({
    initialValues: {
      number_table: "",
      is_qr_table: "", 

      // name_en: "",
    },
    onSubmit: async (values, { setErrors }) => {
      // console.log(JSON.stringify(values));
      try {
        const result = await addTable(values).unwrap();
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
      number_table: Yup.number()
        .typeError(" يجب ان يكون رقم")
        .required("Required"),
    }),
  });

  useEffect(() => {
    if (!isLoading) {
      formik.resetForm(); // Reset the form fields to their initial values
    }
  }, [handleClose, isLoading]);
  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>إضافة طاولة</Modal.Title>
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
              style={{marginTop:'15px'}}
              variant="outlined"
              fullWidth
              size="small"
              error={
                !!formik.touched.is_qr_table && !!formik.errors.is_qr_table
              }
                >
          <InputLabel id="is_qr_table" style={{color:'black'}}>إلى هذه الطاولة qr  هل تريد إضافة </InputLabel>
            <Select
                // fullWidth
                labelId="is_qr_table"
                id="is_qr_table"
                label="إلى هذه الطاولة qr  هل تريد إضافة "
                name="is_qr_table"
                value={formik.values.is_qr_table}
                onChange={formik.handleChange}
                error={
                  !!formik.touched.is_qr_table && !!formik.errors.is_qr_table
                }
                helperText={
                  formik.touched.is_qr_table && formik.errors.is_qr_table
                }
                >
              <MenuItem  value={1}>Yes</MenuItem>
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

          <ButtonWithLoading loading={isLoading} text="حفظ" />
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddTable;
