import { Box, TextField, Unstable_Grid2 as Grid } from "@mui/material";
// import { user, states } from "../data/account-profile";
import { useCallback, useState } from "react";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { Button, Typography } from "@mui/material";
import { useEffect } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  resetupdatedProfile,
  updateProfileAction,
} from "../../../redux/slice/auth/authSlice";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import notify from "../../../utils/useNotification";
import { ToastContainer } from "react-toastify";
import { PermissionsEnum } from "../../../constant/permissions";
import { usePermissions } from "../../../context/PermissionsContext";

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "#E0E3E7",
            "--TextField-brandBorderHoverColor": "#B2BAC2",
            "--TextField-brandBorderFocusedColor": "#6F7E8C",
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
              fontWeight: 700,
              // color: "var(--dark-100)",
            },
            "& label.MuiInputLabel-root": {
              fontWeight: 700,
              color: "var(--dark-100)",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "var(--TextField-brandBorderColor)",
          },
          root: {
            [`.${outlinedInputClasses.notchedOutline}`]: {
              borderRadius: 8,
            },
            [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderHoverColor)",
            },
            [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: "var(--TextField-brandBorderFocusedColor)",
            },
            "& .MuiOutlinedInput-input": {
              fontSize: 14,
              fontWeight: 400,
              color: "var(--gray-100)",
            },
          },
        },
      },
    },
  });

const convertColorFormat = (colorString) => {
  if (colorString && colorString.startsWith("Color(0xff")) {
    return `#${colorString.substring(10, 16)}`;
  }
  // console.log("0000")
  return "#000000"; // Default color if format is incorrect
};

const hexToColorString = (hex) => {
  // console.log(hex);
  return `Color(0xff${hex.substring(1)})`;
};

const AccountProfileDetails = ({ item, getProfileDetails }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();
  const [img, setImg] = useState(null);
  const [imgLogo, setImgLogo] = useState(null);

  const outerTheme = useTheme();

  const onImageChange = (event, type) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const imageUrl = URL.createObjectURL(file);
      if (type === "cover") {
        setImg(imageUrl);
        formik.setFieldValue("cover", file);
      } else {
        setImgLogo(imageUrl);
        formik.setFieldValue("logo", file);
      }
    }
  };

  const putCurrentData = () => {
    if (item) {
      console.log(item);
      formik.resetForm({
        values: {
          user_name: item?.user_name || "",
          name_en: item?.restaurant?.translations.en.name || "",
          name_ar: item?.restaurant?.translations.ar.name || "",
          background_color: convertColorFormat(
            item?.restaurant?.background_color
          ),
          color: convertColorFormat(item?.restaurant?.color),
          facebook_url: item?.restaurant?.facebook_url || "",
          instagram_url: item?.restaurant?.instagram_url || "",
          whatsapp_phone: item?.restaurant?.whatsapp_phone || "",
          note_en: item?.restaurant?.translations.en.note || "",
          note_ar: item?.restaurant?.translations.ar.note || "",
          message_bad: item?.restaurant?.message_bad || "",
          message_good: item?.restaurant?.message_good || "",
          message_perfect: item?.restaurant?.message_perfect || "",
          font_type: item?.restaurant?.font_type || "",
          logo: "",
          cover: "",
          visited: item?.visited || '0'
        },
      });

      setImg(item?.restaurant?.cover);
      setImgLogo(item?.restaurant?.logo);
    }
  };

  useEffect(() => {
    putCurrentData();
  }, [item]);

  const formik = useFormik({
    initialValues: {
      user_name: "",
      name: "",
      background_color: "#000000",
      color: "#000000",
      facebook_url: "",
      instagram_url: "",
      whatsapp_phone: "",
      note: "",
      message_bad: "",
      message_good: "",
      message_perfect: "",
      count_sms: "",
      logo: "",
      cover: "",
    },
    onSubmit: async (values) => {
      const convertedValues = {
        ...values,
        background_color: hexToColorString(values.background_color),
        color: hexToColorString(values.color),
      };
      // console.log(JSON.stringify(convertedValues));
      if (convertedValues.logo === "") {
        delete convertedValues.logo;
      }
      if (convertedValues.cover === "") {
        delete convertedValues.cover;
      }
      await dispatch(updateProfileAction(convertedValues));
      await dispatch(resetupdatedProfile());
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required("الاسم مطلوب"),
      background_color: Yup.string().required("لون الخلفية مطلوب"),
      color: Yup.string().required("اللون مطلوب"),
      // note: Yup.string().required("الملاحظات مطلوبة"),
    }),
  });

  const { loading, updatedDetails, error } = useSelector(
    (state) => state.auth.updatedProfile
  );
  console.log(updatedDetails);

  useEffect(() => {
    if (updatedDetails && updatedDetails.status === true) {
      notify("تم التعديل بنجاح", "success");
      setTimeout(() => {
        getProfileDetails();
      }, 2000);
    }
  }, [updatedDetails, loading]);

  useEffect(() => {
    if (error) {
      notify(error.message, "error");
    }
  }, [error]);

  return (
    <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          paddingTop: 0,
          marginLeft: 0,
        }}
      >
        <ThemeProvider theme={customTheme(outerTheme)}>
          <div className="profile-section-container">
            <div className="profile-section">
              <div className="profile-top-area">
                <label htmlFor="upload-photo" style={{ width: "100%" }}>
                  <img className="" src={img} alt="cover" />
                </label>

                <input
                  accept="image/*"
                  id="upload-photo"
                  name="cover"
                  label="Upload Photo"
                  type="file"
                  onChange={(e) => onImageChange(e, "cover")}
                  style={{ display: "none" }}
                />
              </div>

              <div className="profile-section-top">
                <label htmlFor="upload-photo2" style={{ width: "100%" }}>
                  <img className="profile-avatar" src={imgLogo} alt="profile" />
                </label>
                <input
                  accept="image/*"
                  id="upload-photo2"
                  name="logo"
                  label="Upload Photo"
                  type="file"
                  onChange={(e) => onImageChange(e, "logo")}
                  style={{ display: "none" }}
                />
                <div className="profile-details">
                  <label className="profile-name">{item && item.name}</label>
                </div>
              </div>
              <Grid container spacing={3} sx={{ paddingTop: "15px" }}>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="اسم المستخدم "
                    name="user_name"
                    onChange={formik.handleChange}
                    value={formik.values.user_name}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.user_name && !!formik.errors.user_name
                    }
                    helperText={
                      formik.touched.user_name && formik.errors.user_name
                    }
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="الاسم باللغة العربية"
                    name="name_ar"
                    dir="rtl"
                    onChange={formik.handleChange}
                    value={formik.values.name_ar}
                    onBlur={formik.handleBlur}
                    error={!!formik.touched.name_ar && !!formik.errors.name_ar}
                    helperText={formik.touched.name_ar && formik.errors.name_ar}
                  />
                </Grid>

                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="الاسم باللغة الثانوية"
                    name="name_en"
                    onChange={formik.handleChange}
                    value={formik.values.name_en}
                    onBlur={formik.handleBlur}
                    error={!!formik.touched.name_en && !!formik.errors.name_en}
                    helperText={formik.touched.name_en && formik.errors.name_en}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Facebook"
                    name="facebook_url"
                    onChange={formik.handleChange}
                    value={formik.values.facebook_url}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.facebook_url &&
                      !!formik.errors.facebook_url
                    }
                    helperText={
                      formik.touched.facebook_url && formik.errors.facebook_url
                    }
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Instagram"
                    InputLabelProps={{ shrink: true }}
                    name="instagram_url"
                    onChange={formik.handleChange}
                    value={formik.values.instagram_url}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.instagram_url &&
                      !!formik.errors.instagram_url
                    }
                    helperText={
                      formik.touched.instagram_url &&
                      formik.errors.instagram_url
                    }
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="Whatsapp"
                    InputLabelProps={{ shrink: true }}
                    name="whatsapp_phone"
                    type="tel"
                    onChange={formik.handleChange}
                    value={formik.values.whatsapp_phone}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.whatsapp_phone &&
                      !!formik.errors.whatsapp_phone
                    }
                    helperText={
                      formik.touched.whatsapp_phone &&
                      formik.errors.whatsapp_phone
                    }
                  />
                </Grid>

                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="الملاحظة باللغة العربية"
                    InputLabelProps={{ shrink: true }}
                    name="note_ar"
                    type="text"
                    dir="rtl"
                    onChange={formik.handleChange}
                    value={formik.values.note_ar}
                    onBlur={formik.handleBlur}
                    error={!!formik.touched.note_ar && !!formik.errors.note_ar}
                    helperText={formik.touched.note_ar && formik.errors.note_ar}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    label="الملاحظة باللغة الثانوية"
                    InputLabelProps={{ shrink: true }}
                    name="note_en"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.note_en}
                    onBlur={formik.handleBlur}
                    error={!!formik.touched.note_en && !!formik.errors.note_en}
                    helperText={formik.touched.note_en && formik.errors.note_en}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Message Bad"
                    name="message_bad"
                    onChange={formik.handleChange}
                    value={formik.values.message_bad}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.message_bad &&
                      !!formik.errors.message_bad
                    }
                    helperText={
                      formik.touched.message_bad && formik.errors.message_bad
                    }
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Message Good"
                    name="message_good"
                    onChange={formik.handleChange}
                    value={formik.values.message_good}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.message_good &&
                      !!formik.errors.message_good
                    }
                    helperText={
                      formik.touched.message_good && formik.errors.message_good
                    }
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Message Perfect"
                    name="message_perfect"
                    onChange={formik.handleChange}
                    value={formik.values.message_perfect}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.message_perfect &&
                      !!formik.errors.message_perfect
                    }
                    helperText={
                      formik.touched.message_perfect &&
                      formik.errors.message_perfect
                    }
                  />
                </Grid>

                <Grid xs={12} md={4}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="نوع الخط"
                    name="font_type"
                    onChange={formik.handleChange}
                    value={formik.values.font_type}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.font_type && !!formik.errors.font_type
                    }
                    helperText={
                      formik.touched.font_type && formik.errors.font_type
                    }
                  />
                </Grid>

                <Grid xs={4} md={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Color"
                    name="color"
                    type="color"
                    // onChange={formik.handleChange}
                    onChange={(event) => {
                      const hexColor = event.target.value;
                      formik.setFieldValue("color", hexColor);
                    }}
                    value={formik.values.color}
                    onBlur={formik.handleBlur}
                    error={!!formik.touched.color && !!formik.errors.color}
                    helperText={formik.touched.color && formik.errors.color}
                  />
                </Grid>
                <Grid xs={4} md={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Background"
                    type="color"
                    name="background_color"
                    // onChange={formik.handleChange}
                    onChange={(event) => {
                      const hexColor = event.target.value;
                      // const colorString = hexToColorString(hexColor);
                      formik.setFieldValue("background_color", hexColor);
                    }}
                    value={formik.values.background_color}
                    // value={'#ffffff'}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.background_color &&
                      !!formik.errors.background_color
                    }
                    helperText={
                      formik.touched.background_color &&
                      formik.errors.background_color
                    }
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        </ThemeProvider>
      </Box>

      {hasPermission(PermissionsEnum.update_restaurant_admin) && (
        <Box mt={3}>
          <Button
            variant="outlined"
            sx={{ marginRight: "5px" }}
            onClick={putCurrentData}
          >
            تجاهل
          </Button>

          {loading === true ? (
            <Button variant="outlined" className="">
              <Spinner
                className="m-auto"
                animation="border"
                role="status"
              ></Spinner>
            </Button>
          ) : (
            <Button type="submit" variant="outlined">
              حفظ
            </Button>
          )}
        </Box>
      )}
      <ToastContainer />
    </form>
  );
};

export default AccountProfileDetails;
