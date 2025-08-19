import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Modal, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetTablesQuery } from "../../../redux/slice/tables/tablesApi";
import { useAddOrderMutation } from "../../../redux/slice/order/orderApi";
import notify from "../../../utils/useNotification";

export const ModalAddOrder = ({ show, handleClose, page, id }) => {
  const { data: tables } = useGetTablesQuery("");
  const [addOrder, { isLoading: loading }] = useAddOrderMutation();

  const formik = useFormik({
    initialValues: {
      item_id: id,
      count: "",
      table_id: "",
    },
    onSubmit: async (values, { setErrors }) => {
      const payload = {
        data: [{
          item_id: values.item_id,
          count: values.count,
        }],
        table_id: values.table_id,
      };

      try {
        const result = await addOrder(payload).unwrap();
        if (result.status === true) {
          notify(result.message, "success");
          handleClose();
          formik.resetForm();
        }
      } catch (error) {
        if (error.status === "FETCH_ERROR") {
          notify("No Internet Connection", "error");
        } else {
          notify(error.data.message, "error");
          const backendErrors = error.data.errors || {};
          const formattedErrors = Object.keys(backendErrors).reduce((acc, key) => {
            acc[key] = backendErrors[key][0];
            return acc;
          }, {});
          setErrors(formattedErrors);
        }
      }
    },
    validationSchema: Yup.object({
      count: Yup.number().typeError(" يجب ان يكون رقم").required("Required"),
      table_id: Yup.string().required("Required"),
    }),
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>إضافة طلب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            size="small"
            margin="dense"
            id="count"
            name="count"
            label="الكمية"
            type="text"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.count}
            error={!!formik.touched.count && !!formik.errors.count}
            helperText={formik.touched.count && formik.errors.count}
          />

          <FormControl
            variant="outlined"
            fullWidth
            size="small"
            error={!!formik.touched.table_id && !!formik.errors.table_id}
            sx={{ my: "20px" }}
          >
            <InputLabel id="table_id">رقم الطاولة</InputLabel>
            <Select
              InputLabelProps={{ shrink: true }}
              labelId="table_id"
              id="table_id"
              name="table_id"
              label="رقم الطاولة"
              value={formik.values.table_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {tables?.data?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.number_table}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.table_id && formik.errors.table_id && (
              <FormHelperText>{formik.errors.table_id}</FormHelperText>
            )}
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" className="mx-2" onClick={handleClose}>
            تجاهل
          </Button>
          <Button variant="contained" type="submit">
            {loading ? (
              <Spinner className="m-auto" animation="border" role="status" />
            ) : (
              "حفظ"
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
