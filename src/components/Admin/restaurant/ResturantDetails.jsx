import { Box, TextField, Unstable_Grid2 as Grid, IconButton ,Tooltip} from "@mui/material";
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
  resetupdatedRestaurant,
  updateProfileAction,
  updateRestaurantAction,
} from "../../../redux/slice/auth/authSlice";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import notify from "../../../utils/useNotification";
import { ToastContainer } from "react-toastify";
import { PermissionsEnum, SuperPermissionsEnum } from "../../../constant/permissions";
import { usePermissions } from "../../../context/PermissionsContext";
import { IoQrCodeOutline } from "react-icons/io5";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
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

const ResturantDetails = ({ item, getProfileDetails }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();
  const [img, setImg] = useState(null);
  const [imgLogo, setImgLogo] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showQRTakeOut, setShowQRTakeOut] = useState(false);

  const outerTheme = useTheme();

  useEffect(() => {
    putCurrentData();
    console.log('item',item)
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
    console.log('item : ',item)
  };
  const handleCloseQR = () => {
    setShowQR(false);
  };
  const handleShowQRTakeOut = (item) => {
    setShowQRTakeOut(item);
    console.log('item : ',item)
  };
  const handleCloseQRTakeOut = () => {
    setShowQRTakeOut(false);
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
          font_type: item?.restaurant?.font || "",
          logo: imgLogo,
          cover: img,
          name_url: item?.restaurant?.name_url || "",
          is_welcome_massege:item?.restaurant?.is_welcome_massege||"",
          welcome:item?.restaurant?.welcome||"",
          question:item?.restaurant?.question||"",
          if_answer_no:item?.restaurant?.if_answer_no||"",
          consumer_spending:item?.restaurant?.consumer_spending||"",
          local_administration:item?.restaurant?.local_administration||"",
          reconstruction:item?.restaurant?.reconstruction||"",
          price_km:item?.restaurant?.price_km || "",
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
      is_welcome_massege:item?.restaurant?.is_welcome_massege||"",
      welcome:item?.restaurant?.welcome||"",
      question:item?.restaurant?.question||"",
      if_answer_no:item?.restaurant?.if_answer_no||"",
      consumer_spending:item?.restaurant?.consumer_spending||"",
      local_administration:item?.restaurant?.local_administration||"",
      reconstruction:item?.restaurant?.reconstruction||"",
      price_km:item?.restaurant?.price_km || "",
    },
    onSubmit: async (values) => {
      console.log('values before convert : ',values)
      if(typeof values?.cover === "string")
        delete values?.cover
      if(typeof values?.logo === "string")
        delete values?.logo
      const convertedValues = {
        ...values,
        background_color: hexToColorString(values.background_color),
        color: hexToColorString(values.color),
      };
      console.log('values after convert: ',convertedValues)
     
      // console.log(JSON.stringify(convertedValues));
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
      facebook_url: Yup.string().url("رابط غير صالح"), // Validates if the string is a valid URL
      instagram_url: Yup.string().url("رابط غير صالح"), // Validates if the string is a valid URL
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
                <label
                  htmlFor="upload-photo"
                  style={{ width: "100%", minHeight: "200px" }}
                >
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
                <label
                  htmlFor="upload-photo2"
                  style={
                    {
                      // width: "100%",
                      // boxShadow: "0 4px 8.6px 3px #00000040",
                      // borderRadius: "50%",
                      // minWidth: "140px",
                      // height: "140px",
                      // margin:'-70px 0px 0px 52px',
                      // zIndex:'100',
                      // background:'#FFF'
                    }
                  }
                >
                  <img className="profile-avatar" src={imgLogo} alt="" />
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
                {/* <div className="profile-details">
                  <label className="profile-name">{item && item.name}</label>
                </div> */}
              </div>

                  <div className="d-flex m-auto">
                  {item?.restaurant?.qr_offline!==null &&
               <div className="m-auto">
                  <Grid >
                  <Tooltip title="Qr Offline" placement="top">
                    <IconButton size="large"
                      sx={{ color: "#000" }}
                      onClick={() => handleShowQR(item)}
                    >
                      <IoQrCodeOutline/>
                    </IconButton>
                  </Tooltip>
                    </Grid>
                </div>}
                {item?.restaurant?.qr_takeout!==null &&
               <div className="m-auto">
                  <Grid >
                    <Tooltip title="Qr Takeout" placement="top">
                      <IconButton size="large"
                        sx={{ color: "#000" }}
                        onClick={() => handleShowQRTakeOut(item)}
                      >
                        <IoQrCodeOutline/>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </div>}
                  </div>
              <Grid container spacing={3} sx={{ paddingTop: "15px" }}>
               
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
                    error={
                      !!formik.touched.name_url && !!formik.errors.name_url
                    }
                    helperText={
                      formik.touched.name_url && formik.errors.name_url
                    }
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

                {/* <Grid xs={12} md={4}>
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
                </Grid> */}
                {
                  item?.restaurant?.is_welcome_massege==1 &&(
                    <>
                    <Grid xs={12} md={4}>
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
                        !!formik.touched.welcome &&
                        !!formik.errors.welcome
                      }
                      helperText={
                        formik.touched.welcome &&
                        formik.errors.welcome
                      }
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="question Message"
                      name="question"
                      onChange={formik.handleChange}
                      value={formik.values.question}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.question &&
                        !!formik.errors.question
                      }
                      helperText={
                        formik.touched.question &&
                        formik.errors.question
                      }
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="if answer no Message"
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
                      } />
                  </Grid>
                  </>
                  )
                }
                  <Grid xs={12} md={4}>
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
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
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
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
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
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="km سعر التوصيل بال "
                      name="price_km"
                      onChange={formik.handleChange}
                      type="number"
                      value={formik.values.price_km}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.price_km &&
                        !!formik.errors.price_km
                      }
                      helperText={
                        formik.touched.price_km &&
                        formik.errors.price_km
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

      {(hasPermission(PermissionsEnum.UPDATE_RESTAURANT_ADMIN) || hasPermission(SuperPermissionsEnum.RESTAURANT_UPDATE) )&& (
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
      <Modal show={showQR} onHide={handleCloseQR} centered size="">
      <Modal.Header closeButton className="d-flex justify-content-center">
        <Modal.Title>QR Offline</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <Box
          display={"flex"}
          // flexDirection={isSmallDevice ? "column" : "row"}
          justifyContent={"center"}
          alignItems={"center"}
          m={"20px"}>
          <img
            src={item?.restaurant?.qr_offline}
            alt="click"
            width="70%"
            // height="200px"
            style={{ cursor: "pointer", aspectRatio: "1" }}
          ></img>
           <IconButton>
              <a style={{color:'#111',fontSize:'50px'}}
               href={item?.restaurant?.qr_offline} download={item?.restaurant?.qr_offline}>
                  <DownloadForOfflineIcon fontSize="190px" />  
              </a>
          </IconButton>
          {/* Share Button */}
          <IconButton
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: "Share QR Code",
                    text: "Check out this QR code!",
                    url: item?.restaurant?.qr_offline, // QR image URL
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

    <Modal show={showQRTakeOut} onHide={handleCloseQRTakeOut} centered size="">
      <Modal.Header closeButton className="d-flex justify-content-center">
        <Modal.Title>QR Takeout</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <Box
          display={"flex"}
          // flexDirection={isSmallDevice ? "column" : "row"}
          justifyContent={"center"}
          alignItems={"center"}
          m={"20px"}
        >
          <img
            src={item?.restaurant?.qr_takeout}
            alt="click"
            width="70%"
            // height="200px"
            style={{ cursor: "pointer", aspectRatio: "1" }}
          ></img>
           <IconButton>
              <a style={{color:'#111',fontSize:'50px'}}
               href={item?.restaurant?.qr_takeout} download={item?.restaurant?.qr_takeout}>
                  <DownloadForOfflineIcon fontSize="190px" />  
              </a>
          </IconButton>
          {/* Share Button */}
          <IconButton
            onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: "Share QR Code",
                    text: "Check out this QR code!",
                    url: item?.restaurant?.qr_takeout, // QR image URL
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
