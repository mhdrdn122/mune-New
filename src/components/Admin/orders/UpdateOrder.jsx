import {
  Button,
  TextField,
} from "@mui/material";
import { Modal, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import notify from "../../../utils/useNotification";
import { useUpdateOrderMutation } from "../../../redux/slice/order/orderApi";
import SearchableSelect from "../../../utils/SearchableSelect";

export const UpdateOrder = ({ show, handleClose, page, order }) => {
    const formik = useFormik({
    initialValues: {
      id: order?.id,
      status: order?.status,
      count: order?.count,
    },
    onSubmit: async (values, { setErrors }) => {
      try {
        const result = await updateOrder(values).unwrap();
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

    }),
  });
  
  const [updateOrder, { isLoading: loading, isError, error }] =
  useUpdateOrderMutation();

  const userData = JSON.parse(localStorage.getItem("adminInfo"));

  const options = [
    {
      id: "waiting",
      name: "Waiting",
    },
    {
      id: "accepted",
      name: "Accepted",
    },
    {
      id: "preparation",
      name: "Preparation",
    },
    {
      id: "done",
      name: "Done",
    },
  ];

  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <Modal.Header className="d-flex justify-content-center">
            <Modal.Title>تعديل طلب</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SearchableSelect
              label="الحالة"
              options={options} // Pass the category data
              formik={formik} // Pass the formik instance
              name="status" // Field name in formik
            />
            <TextField
              // size="small"
              margin='normal'
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
