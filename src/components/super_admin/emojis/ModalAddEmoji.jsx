import { Box, Button, TextField } from "@mui/material";
import { Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {} from "../../../redux/slice/categories/categoriesSlice";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import avatar from "../../../assets/avatar.png";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  addNewEmojiAction,
  getAllEmojisAction,
  resetAddState,
} from "../../../redux/slice/super_admin/emoji/emojiSlice";

const ModalAddEmoji = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [badImg, setBadImg] = useState(avatar);
  const [goodImg, setGoodImg] = useState(avatar);
  const [perImg, setPerImg] = useState(avatar);
  const isSmallDevice = useMediaQuery("only screen and (max-width : 992px)");

  const onImageChange = (event, type) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const imageUrl = URL.createObjectURL(file);

      if (type === "bad_image") {
        setBadImg(imageUrl);
        formik.setFieldValue("bad_image", file);
      } else if (type === "good_image") {
        setGoodImg(imageUrl);
        formik.setFieldValue("good_image", file);
      } else {
        setPerImg(imageUrl);
        formik.setFieldValue("perfect_image", file);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      bad_image: null,
      good_image: null,
      perfect_image: null,
    },
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      console.log(JSON.stringify(values));
      await dispatch(addNewEmojiAction(values));
      // await dispatch(());
    },
    validationSchema: Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
      bad_image: Yup.string().required(" الصورة مطلوبة"),
      good_image: Yup.string().required(" الصورة مطلوبة"),
      perfect_image: Yup.string().required(" الصورة مطلوبة"),
    }),
  });

  //select store data
  const { loading, emojiDetails, error } = useSelector(
    (state) => state.emojiSuper.emoji
  );
  console.log(error);
  console.log(emojiDetails);

  const getEmojis = async () => {
    await dispatch(getAllEmojisAction(""));
  };

  useEffect(() => {
    if (emojiDetails && emojiDetails.status === true) {
      notify("تمت الإضافة بنجاح", "success");
      handleClose();
      formik.resetForm();
      setBadImg(avatar);
      setGoodImg(avatar);
      setPerImg(avatar);
      getEmojis();
      dispatch(resetAddState());
    }
  }, [emojiDetails]);

  useEffect(() => {
    if (error) {
      notify(error.message, "error");
      dispatch(resetAddState());
    }
  }, [error]);

  useEffect(() => {
    formik.resetForm();
    setBadImg(avatar);
    setGoodImg(avatar);
    setPerImg(avatar);  
  }, [handleClose]);
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>إضافة رموز تعبيرية</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <TextField
            margin="dense"
            sx={{ width:isSmallDevice? "80%":  "50%" }}
            id="name"
            name="name"
            label="الاسم"
            type="text"
            fullWidth
            variant="outlined"
            focused
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            error={!!formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
            dir="rtl"
          />
          <Box
            display={"flex"}
            flexDirection={isSmallDevice ? "column" : "row"}
            justifyContent={"center"}
            alignItems={"center"}
            m={"20px"}
            gap={4}
          >
            <label
              htmlFor="upload-photo"
              style={{ width: isSmallDevice ? "100%" : "calc(100% / 3)" }}
            >
              <label className="w-100 text-center mb-2">bad image</label>
              {badImg === avatar ? (
                <img
                  src={badImg}
                  alt="click"
                  width="140px"
                  height="120px"
                  style={{
                    cursor: "pointer",
                    aspectRatio: "1",
                    marginLeft: "50px",
                  }}
                ></img>
              ) : (
                <img
                  src={badImg}
                  alt="click"
                  width="100%"
                  // height="120px"
                  style={{ cursor: "pointer", aspectRatio: "1" }}
                ></img>
              )}

              {formik.errors.bad_image && formik.touched.bad_image ? (
                <div className="mt-2 text-center text-danger">
                  {formik.errors.bad_image}
                </div>
              ) : null}
            </label>

            <input
              accept="image/*"
              id="upload-photo"
              name="bad_image"
              label="Upload Photo"
              type="file"
              onChange={(e) => onImageChange(e, "bad_image")}
              style={{ display: "none" }}
            />
            <label
              htmlFor="upload-photo2"
              style={{ width: isSmallDevice ? "100%" : "calc(100% / 3)" }}
            >
              <label className="w-100 text-center mb-2">good image</label>
              {goodImg === avatar ? (
                <img
                  src={goodImg}
                  alt="click"
                  width="140px"
                  height="120px"
                  style={{
                    cursor: "pointer",
                    aspectRatio: "1",
                    marginLeft: "50px",
                  }}
                ></img>
              ) : (
                <img
                  src={goodImg}
                  alt="click"
                  width="100%"
                  //  height="120px"
                  style={{ cursor: "pointer", aspectRatio: "1" }}
                ></img>
              )}

              {formik.errors.good_image && formik.touched.good_image ? (
                <div className="mt-2 text-center text-danger">
                  {formik.errors.good_image}
                </div>
              ) : null}
            </label>

            <input
              accept="image/*"
              id="upload-photo2"
              name="good_image"
              label="Upload Photo"
              type="file"
              onChange={(e) => onImageChange(e, "good_image")}
              style={{ display: "none" }}
            />
            <label
              htmlFor="upload-photo3"
              style={{ width: isSmallDevice ? "100%" : "calc(100% / 3)" }}
            >
              <label className="w-100 text-center mb-2">perfect image</label>
              {perImg === avatar ? (
                <img
                  src={perImg}
                  alt="click"
                  width="140"
                  height="120px"
                  style={{
                    cursor: "pointer",
                    aspectRatio: "1",
                    marginLeft: "50px",
                  }}
                ></img>
              ) : (
                <img
                  src={perImg}
                  alt="click"
                  width="100%"
                  //  height="120px"
                  style={{ cursor: "pointer", aspectRatio: "1" }}
                ></img>
              )}
              {formik.errors.perfect_image && formik.touched.perfect_image ? (
                <div className="mt-2 text-center text-danger">
                  {formik.errors.perfect_image}
                </div>
              ) : null}
            </label>

            <input
              accept="image/*"
              id="upload-photo3"
              name="perfect_image"
              label="Upload Photo"
              type="file"
              onChange={(e) => onImageChange(e, "perfect_image")}
              style={{ display: "none" }}
            />
          </Box>
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

      <ToastContainer />
    </Modal>
  );
};

export default ModalAddEmoji;
