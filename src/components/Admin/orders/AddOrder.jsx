import {
  Box,
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
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import { useGetTablesQuery } from "../../../redux/slice/tables/tablesApi";
import {
  useAddOrderMutation,
  useUpdateOrderMutation,
} from "../../../redux/slice/order/orderApi";
import useError401Admin from "../../../hooks/useError401Admin";
import { useParams } from "react-router-dom";
import SearchableSelect from "../../../utils/SearchableSelect";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllItemsAction } from "../../../redux/slice/items/itemsSlice";
import { useSelector } from "react-redux";

const AddOrder = ({ show, handleClose, page }) => {
  const { data: tables } = useGetTablesQuery("");
  const { tableId, invoiceId } = useParams();
  const dispatch = useDispatch();
  const [addOrder, { isLoading: loading, isError, error }] =
    useAddOrderMutation();
  const userData = JSON.parse(localStorage.getItem("adminInfo"));
  // console.log(show);
  // console.log(typeof(show?.table_id))

  const { triggerRedirect } = useError401Admin(isError, error);
  const { items, error: err } = useSelector((state) => state.items);

  console.log(err);

  useEffect(() => {
    dispatch(getAllItemsAction({ resId: userData.restaurant_id }));
  }, []);

  const formik = useFormik({
    initialValues: {
      item_id: "",
      count: "",
      table_id: parseInt(tableId),
    },
    enableReinitialize: true,
    onSubmit: async (values, { setErrors }) => {
      console.log(JSON.stringify(values));
      let formToSend  = {
        data : [
          {
            item_id : values.item_id,
            count: values.count
          }
        ],
        table_id: values.table_id,
      }
      console.log(formToSend)
      try {
        const result = await addOrder(formToSend).unwrap();
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
      count: Yup.number().typeError(" يجب ان يكون رقم").required("Required"),
      table_id: Yup.number().required("Required"),
    }),
  });

  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <Modal.Header className="d-flex justify-content-center">
            <Modal.Title>إضافة طلب</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SearchableSelect
              label="العنصر"
              options={items?.data || []} // Pass the category data
              formik={formik} // Pass the formik instance
              name="item_id" // Field name in formik
            />
            <TextField
              // size="small"
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
              // dir="rtl"
            />
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="contained" className="mx-2" onClick={handleClose}>
              تجاهل
            </Button>

            {loading === true ? (
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

      {/* <ToastContainer /> */}
    </div>
  );
};

export default AddOrder;
