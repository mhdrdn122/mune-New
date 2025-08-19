import { Box, Button, TextField } from "@mui/material";
import avatar from "../../../assets/avatar.png";
import { Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {} from "../../../redux/slice/categories/categoriesSlice";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import {
  addNewItemAction,
  getAllItemsAction,
  resetAddItem,
} from "../../../redux/slice/items/itemsSlice";
import {
  useAddNewsMutation,
  useUpdateNewsMutation,
} from "../../../redux/slice/news/newsApi";
import useError401Admin from "../../../hooks/useError401Admin";

const UpdateNews = ({ show, handleClose, item }) => {
  const [img, setImg] = useState(avatar);
  const [updateNews, { isLoading: loading, isError, error }] =
    useUpdateNewsMutation();

  const { triggerRedirect } = useError401Admin(isError, error);

  const onImageChange = (event) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImg(imageUrl);
      formik.setFieldValue("image", file);
    }
  };
  useEffect(() => {
    setImg(item?.image);
  }, []);
  const formik = useFormik({
    initialValues: {
      id: item?.id,
      name_ar: item?.translations?.ar?.name,
      name_en: item?.translations?.en?.name,
      description_ar: item?.translations?.ar?.description,
      description_en: item?.translations?.en?.description,
      image: null,
    },
    enableReinitialize: true,
    onSubmit: async (values, { setErrors }) => {
      console.log(JSON.stringify(values));

      try {
        const result = await updateNews(values).unwrap();
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
      // name_ar: Yup.string().required("الاسم باللغة العربية مطلوب"),
      // name_en: Yup.string().required("الاسم باللغة الثانوية مطلوب"),
      // description_ar: Yup.string().required("الوصف باللغة العربية مطلوب"),
      // description_en: Yup.string().required("الوصف باللغة الثانوية مطلوب"),
      // // price: Yup.string().required("السعر مطلوب"),
      // image: Yup.string().required("Image Required"),
    }),
  });

  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <Modal.Header className="d-flex justify-content-center">
            <Modal.Title>تعديل خبر</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Box display={"flex"} justifyContent={"center"} mb={"20px"}>
              <label htmlFor="upload-photo">
                {img === avatar ? (
                  <img
                    src={img}
                    alt="click"
                    width="140px"
                    height="120px"
                    style={{ cursor: "pointer", aspectRatio: "3/2" }}
                  ></img>
                ) : (
                  <img
                    src={img}
                    alt="click"
                    width="100%"
                    height="200px"
                    style={{ cursor: "pointer", aspectRatio: "3/2" }}
                  ></img>
                )}
              </label>

              <input
                accept="image/*"
                id="upload-photo"
                name="image"
                label="Upload Photo"
                type="file"
                onChange={onImageChange}
                style={{ display: "none" }}
              />
            </Box>
            {formik.errors.image && formik.touched.image ? (
              <div className="text-danger text-center my-2">
                {formik.errors.image}
              </div>
            ) : null}
            <TextField
              margin="dense"
              id="name_ar"
              name="name_ar"
              label="الاسم باللغة العربية"
              type="text"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name_ar}
              error={!!formik.touched.name_ar && !!formik.errors.name_ar}
              helperText={formik.touched.name_ar && formik.errors.name_ar}
              dir="rtl"
            />
            <TextField
              margin="dense"
              id="name_en"
              name="name_en"
              label="الاسم باللغة الثانوية"
              type="text"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name_en}
              error={!!formik.touched.name_en && !!formik.errors.name_en}
              helperText={formik.touched.name_en && formik.errors.name_en}
            />
            <TextField
              margin="dense"
              id="description_ar"
              name="description_ar"
              label="الوصف باللغة العربية"
              type="text"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description_ar}
              error={
                !!formik.touched.description_ar &&
                !!formik.errors.description_ar
              }
              helperText={
                formik.touched.description_ar && formik.errors.description_ar
              }
            />
            <TextField
              margin="dense"
              id="description_en"
              name="description_en"
              label="الوصف باللغة الثانوية"
              type="text"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description_en}
              error={
                !!formik.touched.description_en &&
                !!formik.errors.description_en
              }
              helperText={
                formik.touched.description_en && formik.errors.description_en
              }
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
    </div>
  );
};

export default UpdateNews;
