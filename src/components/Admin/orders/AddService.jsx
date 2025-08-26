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
  import { useEffect, useState } from "react";
  import { useDispatch } from "react-redux";
  import { getAllItemsAction } from "../../../redux/slice/items/itemsSlice";
  import { useSelector } from "react-redux";
  import { useGetServicesQuery } from "../../../redux/slice/service/serviceApi";
import axios from "axios";
import { baseURLLocalPublic } from "../../../Api/baseURLLocal";
const AddService = ({ show, handleClose, page ,refresh}) => {
    const {
        data: items,
        isLoading: loading2,
        isError2,
        error2,
        refetch,
        isFetching
      } = useGetServicesQuery({ refresh});
    
    const { data: tables } = useGetTablesQuery("");
    const { tableId, invoiceId } = useParams();
    const dispatch = useDispatch();

    const userData = JSON.parse(localStorage.getItem("adminInfo"));
    
    useEffect(() => {
      dispatch(getAllItemsAction({ resId: userData.restaurant_id }));
    }, []);

    const [loading,setLoading]=useState(false)

    const formik = useFormik({
      initialValues: {
        service_id: "",
        count: "",
        table_id: parseInt(tableId),
      },
      enableReinitialize: true,
      onSubmit: async (values, { setErrors }) => {
        console.log(JSON.stringify(values));
        let formToSend = {
              service_id : values.service_id,
              count: values.count,
              table_id: values.table_id,
        }
        console.log('formToSend : ',formToSend)
        try {
            setLoading(true)
          const result = await axios.post(`${baseURLLocalPublic}/admin_api/add_service_to_order`, {
            ...formToSend,

          },{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
                }
          })
          console.log("result Service :", result);
          if (result.status === 200) {
            notify(result.data.message, "success");
            handleClose();
            formik.resetForm();
          }
        } catch (error) {
          console.error("Failed to add service:", error);
          if (error.status === "FETCH_ERROR") {
            notify("No Internet Connection", "error");
          } else {
            notify(error.response.data.message, "error");
            const backendErrors = error.response.data.errors;
            const formattedErrors = {};
            for (const key in backendErrors) {
              formattedErrors[key] = backendErrors[key][0];
            }
            // console.log(formattedErrors);
            setErrors(formattedErrors);
          }
        }finally{
            setLoading(false)
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
              <Modal.Title>إضافة خدمة</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SearchableSelect
                label="الخدمة"
                options={items?.data || []} // Pass the category data
                formik={formik} // Pass the formik instance
                name="service_id" // Field name in formik
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
}

export default AddService