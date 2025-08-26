import {
  Box,
  TextField,
  Unstable_Grid2 as Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
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
  resetupdatedRestaurant,
  updateProfileAction,
  updateRestaurantAction,
} from "../../../redux/slice/auth/authSlice";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import notify from "../../../utils/useNotification";
import { ToastContainer } from "react-toastify";
import {
  PermissionsEnum,
  SuperPermissionsEnum,
} from "../../../constant/permissions";
import { usePermissions } from "../../../context/PermissionsContext";
import { IoQrCodeOutline } from "react-icons/io5";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { FaShareAlt } from "react-icons/fa";

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
              borderRadius: 12,
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
  return "#000000";
};

const hexToColorString = (hex) => {
  return `Color(0xff${hex.substring(1)})`;
};

const ResturantDetails = ({ item, getProfileDetails }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();
  const [img, setImg] = useState(null);
  const [imgLogo, setImgLogo] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [showQRTakeOut, setShowQRTakeOut] = useState(false);

  const outerTheme = useTheme();

  console.log(item)
  useEffect(() => {
    putCurrentData();
    console.log("item", item);
  }, [item]);

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
  const handleShowQR = (item) => {
    setShowQR(item);
    console.log("item : ", item);
  };
  const handleCloseQR = () => {
    setShowQR(false);
  };
  const handleShowQRTakeOut = (item) => {
    setShowQRTakeOut(item);
    console.log("item : ", item);
  };
  const handleCloseQRTakeOut = () => {
    setShowQRTakeOut(false);
  };
  const putCurrentData = () => {
    if (item) {
      console.log(item?.user_name);
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
          font_type: item?.restaurant?.font || "",
          logo: imgLogo,
          cover: img,
          name_url: item?.restaurant?.name_url || "",
          is_welcome_massege: item?.restaurant?.is_welcome_massege || "",
          welcome: item?.restaurant?.welcome || "",
          question: item?.restaurant?.question || "",
          if_answer_no: item?.restaurant?.if_answer_no || "",
          consumer_spending: item?.restaurant?.consumer_spending || "",
          local_administration: item?.restaurant?.local_administration || "",
          reconstruction: item?.restaurant?.reconstruction || "",
          price_km: item?.restaurant?.price_km || "",
        },
      });

      setImg(item?.restaurant?.cover);
      setImgLogo(item?.restaurant?.logo);
    }
  };

  const formik = useFormik({
    initialValues: {
      user_name: item?.user_name || "",
      name_en: item?.restaurant?.translations.en.name || "",
      name_ar: item?.restaurant?.translations.ar.name || "",
      background_color: convertColorFormat(item?.restaurant?.background_color),
      color: convertColorFormat(item?.restaurant?.color),
      facebook_url: item?.restaurant?.facebook_url || "",
      instagram_url: item?.restaurant?.instagram_url || "",
      whatsapp_phone: item?.restaurant?.whatsapp_phone || "",
      note_en: item?.restaurant?.translations.en.note || "",
      note_ar: item?.restaurant?.translations.ar.note || "",
      message_bad: item?.restaurant?.message_bad || "",
      message_good: item?.restaurant?.message_good || "",
      message_perfect: item?.restaurant?.message_perfect || "",
      font_type: item?.restaurant?.font || "",
      logo: imgLogo,
      cover: img,
      name_url: item?.restaurant?.name_url || "",
      is_welcome_massege: item?.restaurant?.is_welcome_massege || "",
      welcome: item?.restaurant?.welcome || "",
      question: item?.restaurant?.question || "",
      if_answer_no: item?.restaurant?.if_answer_no || "",
      consumer_spending: item?.restaurant?.consumer_spending || "",
      local_administration: item?.restaurant?.local_administration || "",
      reconstruction: item?.restaurant?.reconstruction || "",
      price_km: item?.restaurant?.price_km || "",
    },
    onSubmit: async (values) => {
      console.log("values before convert : ", values);
      if (typeof values?.cover === "string") delete values?.cover;
      if (typeof values?.logo === "string") delete values?.logo;
      const convertedValues = {
        ...values,
        background_color: hexToColorString(values.background_color),
        color: hexToColorString(values.color),
      };
      console.log("values after convert: ", convertedValues);

      if (convertedValues.logo === "") {
        delete convertedValues.logo;
      }
      if (convertedValues.cover === "") {
        delete convertedValues.cover;
      }
      await dispatch(updateRestaurantAction(convertedValues));
      await dispatch(resetupdatedRestaurant());
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required("الاسم مطلوب"),
      background_color: Yup.string().required("لون الخلفية مطلوب"),
      color: Yup.string().required("اللون مطلوب"),
      facebook_url: Yup.string().url("رابط غير صالح"),
      instagram_url: Yup.string().url("رابط غير صالح"),
    }),
  });

  const { loading, updatedDetails, error } = useSelector(
    (state) => state.auth.updatedRestaurant
  );

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
          bgcolor: "#f5f5f5",
          borderRadius: "16px",
          p: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <ThemeProvider theme={customTheme(outerTheme)}>
          <Grid container spacing={3}>
            {/* Top Row: Cover Image, Logo, and QR */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "12px",
                  // overflow: "hidden",
                  mb: 10,
                  display: "inline-block",
                  width: "100% !important",
                }}
              >
                <label htmlFor="upload-photo" className="w-full ">
                  <img
                    src={img || "/placeholder-cover.jpg"}
                    alt="Cover"
                    className="w-full"
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      height: "250px",
                      objectFit: "cover",
                      minHeight: "250px",
                      borderRadius: "40px",
                      display: "inline-block",
                    }}
                  />
                  <input
                    accept="image/*"
                    id="upload-photo"
                    name="cover"
                    type="file"
                    onChange={(e) => onImageChange(e, "cover")}
                    style={{ display: "none" }}
                  />
                </label>
                <Box sx={{ position: "absolute", top: "20px", left: "20px" }}>
                  {item?.restaurant?.qr_offline && (
                    <Tooltip title="Qr Offline" placement="top">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#fff",
                          padding:"10px",
                          bgcolor: "#BDD358",
                          borderRadius:"10px",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                        }}
                        onClick={() => handleShowQR(item)}
                      >
                        <IoQrCodeOutline fontSize={30} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {item?.restaurant?.qr_takeout && (
                    <Tooltip title="Qr Takeout" placement="top">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#fff",
                          padding:"10px",
                          bgcolor: "#BDD358",
                          borderRadius:"10px",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                        }}
                        onClick={() => handleShowQRTakeOut(item)}
                      >
                        <IoQrCodeOutline fontSize={30} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <label
                  htmlFor="upload-photo2"
                  style={{
                    position: "absolute",
                    bottom: "-70px",
                    left: "25%",
                    transform: "translate(-50%)",
                  }}
                >
                  <img
                    src={imgLogo || "/placeholder-logo.jpg"}
                    alt="Logo"
                    style={{
                      borderRadius: "50%",
                      width: "120px",
                      height: "120px",
                      border: "4px solid #fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  />
                  <input
                    accept="image/*"
                    id="upload-photo2"
                    name="logo"
                    type="file"
                    onChange={(e) => onImageChange(e, "logo")}
                    style={{ display: "none" }}
                  />
                </label>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              className="gap-3 flex flex-col bg-[#BDD358] max-h-[250px] rounded-2xl py-4 px-3 my-3"
            >
              {/* <Grid container spacing={2}> */}
              <Grid item xs={12}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  label="اسم الرابط"
                  name="name_url"
                  onChange={formik.handleChange}
                  value={formik.values.name_url}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.name_url && !!formik.errors.name_url}
                  helperText={formik.touched.name_url && formik.errors.name_url}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              {/* </Grid> */}
            </Grid>

            {/* Second Row: Three Columns */}
            <Grid item xs={12} md={4}>
              {/* <Grid container spacing={2}> */}
              {item?.restaurant?.is_welcome_massege == 1 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="Welcome Message"
                      name="welcome"
                      onChange={formik.handleChange}
                      value={formik.values.welcome}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.welcome && !!formik.errors.welcome
                      }
                      helperText={
                        formik.touched.welcome && formik.errors.welcome
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="Question Message"
                      name="question"
                      onChange={formik.handleChange}
                      value={formik.values.question}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.question && !!formik.errors.question
                      }
                      helperText={
                        formik.touched.question && formik.errors.question
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="If Answer No Message"
                      name="if_answer_no"
                      onChange={formik.handleChange}
                      value={formik.values.if_answer_no}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.if_answer_no &&
                        !!formik.errors.if_answer_no
                      }
                      helperText={
                        formik.touched.if_answer_no &&
                        formik.errors.if_answer_no
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                    />
                  </Grid>
                </>
              )}
              <div className="flex flex-col gap-1">
                <Grid item xs={12}>
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
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
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
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
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
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
              </div>

              {/* </Grid> */}
            </Grid>

            <Grid item xs={12} md={4} className="flex flex-col gap-2  ">
              {/* <Grid container  */}

              <div className="flex items-center">
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Color"
                    name="color"
                    type="color"
                    onChange={(event) => {
                      const hexColor = event.target.value;
                      formik.setFieldValue("color", hexColor);
                    }}
                    value={formik.values.color}
                    onBlur={formik.handleBlur}
                    error={!!formik.touched.color && !!formik.errors.color}
                    helperText={formik.touched.color && formik.errors.color}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    label="Background"
                    type="color"
                    name="background_color"
                    onChange={(event) => {
                      const hexColor = event.target.value;
                      formik.setFieldValue("background_color", hexColor);
                    }}
                    value={formik.values.background_color}
                    onBlur={formik.handleBlur}
                    error={
                      !!formik.touched.background_color &&
                      !!formik.errors.background_color
                    }
                    helperText={
                      formik.touched.background_color &&
                      formik.errors.background_color
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                    }}
                  />
                </Grid>
              </div>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  label="إنفاق استهلاكي"
                  name="consumer_spending"
                  onChange={formik.handleChange}
                  value={formik.values.consumer_spending}
                  onBlur={formik.handleBlur}
                  type="number"
                  error={
                    !!formik.touched.consumer_spending &&
                    !!formik.errors.consumer_spending
                  }
                  helperText={
                    formik.touched.consumer_spending &&
                    formik.errors.consumer_spending
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  label="إدارة محلية"
                  name="local_administration"
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.local_administration}
                  onBlur={formik.handleBlur}
                  error={
                    !!formik.touched.local_administration &&
                    !!formik.errors.local_administration
                  }
                  helperText={
                    formik.touched.local_administration &&
                    formik.errors.local_administration
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  label="إعادة إعمار"
                  name="reconstruction"
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.reconstruction}
                  onBlur={formik.handleBlur}
                  error={
                    !!formik.touched.reconstruction &&
                    !!formik.errors.reconstruction
                  }
                  helperText={
                    formik.touched.reconstruction &&
                    formik.errors.reconstruction
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  label="km سعر التوصيل بال"
                  name="price_km"
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.price_km}
                  onBlur={formik.handleBlur}
                  error={!!formik.touched.price_km && !!formik.errors.price_km}
                  helperText={formik.touched.price_km && formik.errors.price_km}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>

              {/* </Grid> */}
            </Grid>

            <Grid item xs={12} md={4} className="flex flex-col gap-3">
              {/* <Grid container spacing={2}> */}
              <Grid item xs={12}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
                    !!formik.touched.message_bad && !!formik.errors.message_bad
                  }
                  helperText={
                    formik.touched.message_bad && formik.errors.message_bad
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </Grid>
              {/* </Grid> */}
            </Grid>
          </Grid>
        </ThemeProvider>
      </Box>

      {(hasPermission(PermissionsEnum.UPDATE_RESTAURANT_ADMIN) ||
        hasPermission(SuperPermissionsEnum.RESTAURANT_UPDATE)) && (
        <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="contained"
            sx={{
              mr: 2,
              bgcolor: "#e0e0e0",
              color: "#333",
              "&:hover": { bgcolor: "#d0d0d0" },
            }}
            onClick={putCurrentData}
          >
            تجاهل
          </Button>
          {loading ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: "#e0e0e0",
                color: "#333",
                "&:hover": { bgcolor: "#d0d0d0" },
              }}
            >
              <Spinner className="m-auto" animation="border" role="status" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#a50000ff",
                color: "#fff",
                "&:hover": { bgcolor: "#a15252ff" },
              }}
            >
              حفظ
            </Button>
          )}
        </Box>
      )}
      <ToastContainer />
      <Modal show={showQR} onHide={handleCloseQR} centered size="lg">
        <Modal.Header
          closeButton
          className="d-flex justify-content-center"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <Modal.Title>QR Offline</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="d-flex flex-column align-items-center"
          style={{ backgroundColor: "#fff" }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            m="20px"
            gap={2}
          >
            <img
              src={item?.restaurant?.qr_offline}
              alt="QR Offline"
              style={{ width: "200px", height: "200px", objectFit: "contain" }}
            />
            <IconButton>
              <a
                href={item?.restaurant?.qr_offline}
                download={item?.restaurant?.qr_offline}
                style={{ color: "#111", fontSize: "50px" }}
              >
                <DownloadForOfflineIcon fontSize="large" />
              </a>
            </IconButton>
            <IconButton
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: "Share QR Code",
                      text: "Check out this QR code!",
                      url: item?.restaurant?.qr_offline,
                    });
                    console.log("QR code shared successfully!");
                  } catch (error) {
                    console.error("Error sharing QR code:", error.message);
                  }
                } else {
                  alert("Web Share API is not supported in your browser.");
                }
              }}
            >
              <FaShareAlt style={{ fontSize: "30px", color: "#000" }} />
            </IconButton>
          </Box>
        </Modal.Body>
      </Modal>

      <Modal
        show={showQRTakeOut}
        onHide={handleCloseQRTakeOut}
        centered
        size="lg"
      >
        <Modal.Header
          closeButton
          className="d-flex justify-content-center"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <Modal.Title>QR Takeout</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="d-flex flex-column align-items-center"
          style={{ backgroundColor: "#fff" }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            m="20px"
            gap={2}
          >
            <img
              src={item?.restaurant?.qr_takeout}
              alt="QR Takeout"
              style={{ width: "200px", height: "200px", objectFit: "contain" }}
            />
            <IconButton>
              <a
                href={item?.restaurant?.qr_takeout}
                download={item?.restaurant?.qr_takeout}
                style={{ color: "#111", fontSize: "50px" }}
              >
                <DownloadForOfflineIcon fontSize="large" />
              </a>
            </IconButton>
            <IconButton
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: "Share QR Code",
                      text: "Check out this QR code!",
                      url: item?.restaurant?.qr_takeout,
                    });
                    console.log("QR code shared successfully!");
                  } catch (error) {
                    console.error("Error sharing QR code:", error.message);
                  }
                } else {
                  alert("Web Share API is not supported in your browser.");
                }
              }}
            >
              <FaShareAlt style={{ fontSize: "30px", color: "#000" }} />
            </IconButton>
          </Box>
        </Modal.Body>
      </Modal>
    </form>
  );
};

export default ResturantDetails;
