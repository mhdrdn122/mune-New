import {
  Box,
  TextField,
  Unstable_Grid2 as Grid,
  Button,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FilledInput,
  ListItemText,
  // makeStyles,
} from "@mui/material";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { FormLabel, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { } from "../../../redux/slice/categories/categoriesSlice";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useGetMenusQuery } from "../../../redux/slice/super_admin/menu/menusApi";
import { getAllEmojisAction } from "../../../redux/slice/super_admin/emoji/emojiSlice";
import { getAllCitiesAction } from "../../../redux/slice/super_admin/city/citySlice";
import { useAddNewRestMutation, useGenerateAppsMutation, useGetFontsQuery } from "../../../redux/slice/super_admin/resturant/resturantsApi";
import { useGetRestManagersQuery } from "../../../redux/slice/super_admin/restManagers/restManagerApi";
import useError401 from "../../../hooks/useError401 ";
import SearchableSelect from "../../../utils/SearchableSelect";

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

const hexToColorString = (hex) => {
  // console.log(hex);
  return `Color(0xff${hex.substring(1)})`;
};

const AddRest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [img, setImg] = useState(null);
  const [imgLogo, setImgLogo] = useState(null);
  const [logo_home_page, setLogo_home_page] = useState(null);
  const [background_image_home_page, setBackGroundImageHome] = useState(null);
  const [background_image_category, setBackGroundImageCategory] = useState(null);
  const [background_image_sub, setBackGroundImageSub] = useState(null);
  const [background_image_item, setBackGroundImageItem] = useState(null);
  // const [loading, setLoading] = useState(false);
  const outerTheme = useTheme();

  const { data: managers } = useGetRestManagersQuery({ page: 1, perpage: 1000 });
  const { data: fonts } = useGetFontsQuery({ language: 'en' });
  const { data: fontsArabic } = useGetFontsQuery({ language: 'ar' });
  const { cities } = useSelector((state) => state.citySuper);
  const { emojis } = useSelector((state) => state.emojiSuper);
  const { data: menus } = useGetMenusQuery(1);
  const [addNewRest, { isLoading: loading, isSuccess, isError, error }] =
    useAddNewRestMutation();

  const [generateApps, { isLoading: loadingGenerateApps }] =
    useGenerateAppsMutation();

  const { triggerRedirect } = useError401(isError, error);

  const onImageChange = (event, type) => {
    console.log('event : ', event.currentTarget.files[0])
    console.log('type : ', type)
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      const imageUrl = URL.createObjectURL(file);
      if (type === "cover") {
        setImg(imageUrl);
        formik.setFieldValue("cover", file);
      } else if (type === "logo") {
        setImgLogo(imageUrl);
        formik.setFieldValue("logo", file);
      }
      else if (type === "logo_home_page") {
        setLogo_home_page(imageUrl)
        formik.setFieldValue("logo_home_page", file)
      }
      else if (type === "background_image_home_page") {
        setBackGroundImageHome(imageUrl);
        formik.setFieldValue("background_image_home_page", file);
      }
      else if (type === "background_image_category") {
        setBackGroundImageCategory(imageUrl);
        formik.setFieldValue("background_image_category", file);
      }
      else if (type === "background_image_sub") {
        setBackGroundImageSub(imageUrl);
        formik.setFieldValue("background_image_sub", file);
      }
      else if (type === "background_image_item") {
        setBackGroundImageItem(imageUrl);
        formik.setFieldValue("background_image_item", file);
      }
    }
  };
  const fetchEmojis = async () => {
    await dispatch(getAllEmojisAction(1));
  };
  const fetchCities = async () => {
    await dispatch(getAllCitiesAction(1));
  };

  useEffect(() => {
    fetchEmojis();
    fetchCities();
  }, []);

  const removeNullValues = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== "")
    );
  };
  const formik = useFormik({
    initialValues: {
      name_en: "",
      name_ar: "",
      name_url: "",
      user_link: "",
      admin_link: "",
      delivery_link: "",
      user_name: "",
      name_admin: "",
      background_color: "#000000",
      color: "#000000",
      f_color_category: "#000",
      f_color_sub: "#000",
      f_color_item: "#000",
      f_color_rating: "#000",
      facebook_url: "",
      instagram_url: "",
      whatsapp_phone: "",
      mobile: "",
      end_date: "",
      note_en: "",
      note_ar: "",
      message_bad: "",
      message_good: "",
      message_perfect: "",
      // count_sms: "",
      logo: null,
      logo_home_page: null,
      cover: null,
      font_type: "",
      is_rate: "",
      is_active: 1,
      is_table: "",
      city_id: "",
      emoji_id: "",
      menu_template_id: "",
      password: "",
      is_order: "",
      admin_id: "",
      font_id_en: '',
      font_id_ar: '',
      rate_format: "",
      is_taxes: "",
      welcome: "",
      question: "",
      if_answer_no: "",
      is_welcome_massege: "",
      longitude: '',
      latitude: '',
      accepted_by_waiter: '',
      is_sub_move: '',
      is_takeout: '',
      is_delivery: '',
      consumer_spending: "1",
      local_administration: "1",
      reconstruction: "1",
      image_or_color: '', // for the background
      rate_opacity: '',
      sub_opacity: '',
      image_or_write: '', // for logo 
      logo_shape: '',
      message_in_home_page: '',
      fav_lang: '',
      font_size_welcome: '',
      font_type_welcome: '',
      empty_image: '',
      home_opacity: '',
      font_size_category: '',
      font_type_category_ar: '',
      font_type_category_en: '',
      font_bold_category: '',
      font_size_item: '',
      font_type_item_ar: '',
      font_type_item_en: '',
      font_bold_item: '',
      price_type: '',
      share_item_whatsapp: '',
    },
    onSubmit: async (values, { setErrors }) => {
      console.log('waiting')
      const convertedValues = {
        ...values,
        background_color: hexToColorString(values.background_color),
        color: hexToColorString(values.color),
        f_color_category: hexToColorString(values.f_color_category),
        f_color_sub: hexToColorString(values.f_color_sub),
        f_color_item: hexToColorString(values.f_color_item),
        f_color_rating: hexToColorString(values.f_color_rating),
      };
      if (values.cover === null) {
        notify("Please Enter Cover", "warn");
        return;
      }
      if (values.logo === null) {
        notify("Please Enter Logo", "warn");
        return;
      }

      const cleanedData = removeNullValues(convertedValues);
      console.log("cleanedData : ", cleanedData);

      try {
        const result = await addNewRest(cleanedData).unwrap();
        if(result?.status){
         await generateApps(result?.data?.id)
        }
        console.log("added successfully:", result);
        if (result.status === true) {
          notify(result.message, "success");
          setImgLogo(null);
          setImg(null);
          formik.resetForm();
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to add:", error);
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
      name_en: Yup.string().required("Required"),
      name_ar: Yup.string().required("Required"),
      name_url: Yup.string()
        // .matches(/^[a-zA-Z0-9_-]+$/, "Name URL can only contain letters, numbers, underscores, and hyphens")
        .required("Required"),
      // user_name: Yup.string().required("Required"),
      // name_admin: Yup.string().required("Required"),
      background_color: Yup.string().required("Required"),
      color: Yup.string().required("Required"),
      note_en: Yup.string().required("Required"),
      note_ar: Yup.string().required("Required"),

      user_link: Yup.string(),
      admin_link: Yup.string(),
      delivery_link: Yup.string(),
      // end_date: Yup.string().required("Required"),
      // logo: Yup.string().required("Required"),
      // cover: Yup.string().required("Required"),
      city_id: Yup.string().required("Required"),
      menu_template_id: Yup.string().required("Required"),
      emoji_id: Yup.string().required("Required"),
      // password: Yup.string().required("Required"),
      // font_type: Yup.string().required("Required"),
      // mobile: Yup.string().required("Required"),
      is_rate: Yup.string().required("Required"),
      is_active: Yup.string().required("Required"),
      is_table: Yup.string().required("Required"),
      is_order: Yup.string().required("Required"),
      facebook_url: Yup.string().url("رابط غير صالح"), // Validates if the string is a valid URL
      instagram_url: Yup.string().url("رابط غير صالح"),
      // rate_format:Yup.string().required("Required"),
      is_taxes: Yup.string().required("Required"),
    }),
  });

  return (
    <div className="container">
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
                    {img ? (
                      <img
                        src={img}
                        alt="cover"
                        className=""
                        style={{ cursor: "pointer" }}
                      ></img>
                    ) : (
                      <div className="upload_icon">
                        <LuPlus />
                      </div>
                    )}
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


                <div className="d-flex">

                  <div className="profile-section-top mb-3">
                    <label htmlFor="upload-photo7" style={{ width: "10%" }}>

                      {logo_home_page ? (
                        <>
                          <img
                            src={logo_home_page}
                            alt="profile"
                            className="profile-avatar"
                          ></img>
                        </>
                      ) : (
                        <div className="upload_icon_logo">
                          <LuPlus />
                        </div>
                      )}
                    </label>
                    <input
                      accept="image/*"
                      id="upload-photo7"
                      name="logo_home_page"
                      label="Upload Photo"
                      type="file"
                      onChange={(e) => onImageChange(e, "logo_home_page")}
                      style={{ display: "none" }}
                    />
                    <p className="mt-5">logo home page</p>

                  </div>
                  <div className="profile-section-top">
                    <label className="" htmlFor="upload-photo2" style={{ width: "10%" }}>

                      {imgLogo ? (
                        <img
                          src={imgLogo}
                          alt="profile"
                          className="profile-avatar"
                        ></img>
                      ) : (
                        <div className="upload_icon_logo">
                          <LuPlus />
                        </div>
                      )}
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
                    <p className="mt-5">logo</p>

                  </div>

                </div>

                <>
                  <div className="bg-images-container mt-5" >
                    <div>
                      <input
                        accept="image/*"
                        id="upload-photo3"
                        name="background_image_home_page"
                        label="Upload Photo"
                        type="file"
                        onChange={(e) => onImageChange(e, "background_image_home_page")}
                        style={{ display: "none" }}

                      />
                      <label htmlFor="upload-photo3" >
                        {background_image_home_page ? (
                          <img
                            src={background_image_home_page}
                            alt="profile"
                            className="profile-avatar"
                          ></img>
                        ) : (
                          <div className="upload_icon_logo">
                            <LuPlus />
                          </div>
                        )}
                        bg-image home
                      </label>

                    </div>

                    <div>
                      <label htmlFor="upload-photo4" >
                        {background_image_category ? (
                          <img
                            src={background_image_category}
                            alt="background_image_category"
                            className="profile-avatar"
                          ></img>
                        ) : (
                          <div className="upload_icon_logo">
                            <LuPlus />
                          </div>
                        )}
                        bg-image category
                      </label>

                      <input
                        accept="image/*"
                        id="upload-photo4"
                        name="background_image_category"
                        label="Upload Photo"
                        type="file"
                        onChange={(e) => onImageChange(e, "background_image_category")}
                        style={{ display: "none" }}
                      />
                    </div>

                    <div>
                      <label htmlFor="upload-photo5" >
                        {background_image_sub ? (
                          <img
                            src={background_image_sub}
                            alt="profile"
                            className="profile-avatar"
                          ></img>
                        ) : (
                          <div className="upload_icon_logo">
                            <LuPlus />
                          </div>
                        )}
                        bg-image sub
                      </label>
                      <input
                        accept="image/*"
                        id="upload-photo5"
                        name="background_image_sub"
                        label="Upload Photo"
                        type="file"
                        onChange={(e) => onImageChange(e, "background_image_sub")}
                        style={{ display: "none" }}

                      />
                    </div>
                    <div>
                      <label htmlFor="upload-photo6" >
                        {background_image_item ? (
                          <img
                            src={background_image_item}
                            alt="profile"
                            className="profile-avatar"
                          ></img>
                        ) : (
                          <div className="upload_icon_logo">
                            <LuPlus />
                          </div>
                        )}
                        bg-image item
                      </label>
                      <input
                        accept="image/*"
                        id="upload-photo6"
                        name="background_image_item"
                        label="Upload Photo"
                        type="file"
                        onChange={(e) => onImageChange(e, "background_image_item")}
                        style={{ display: "none" }}

                      />
                    </div>
                  </div>
                </>
                <Grid container spacing={3} sx={{ paddingTop: "25px" }}>
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
                      error={
                        !!formik.touched.name_ar && !!formik.errors.name_ar
                      }
                      helperText={
                        formik.touched.name_ar && formik.errors.name_ar
                      }
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
                      error={
                        !!formik.touched.name_en && !!formik.errors.name_en
                      }
                      helperText={
                        formik.touched.name_en && formik.errors.name_en
                      }
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <TextField
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
                      label="رابط تطبيق المستخدم "
                      name="user_link"
                      onChange={formik.handleChange}
                      value={formik.values.user_link}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.user_link && !!formik.errors.user_link
                      }
                      helperText={
                        formik.touched.user_link && formik.errors.user_link
                      }
                    />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="رابط تطبيق المدير "
                      name="admin_link"
                      onChange={formik.handleChange}
                      value={formik.values.admin_link}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.admin_link && !!formik.errors.admin_link
                      }
                      helperText={
                        formik.touched.admin_link && formik.errors.admin_link
                      }
                    />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="رابط تطبيق عامل التوصيل "
                      name="delivery_link"
                      onChange={formik.handleChange}
                      value={formik.values.delivery_link}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.delivery_link && !!formik.errors.delivery_link
                      }
                      helperText={
                        formik.touched.delivery_link && formik.errors.delivery_link
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
                        formik.touched.facebook_url &&
                        formik.errors.facebook_url
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
                      error={
                        !!formik.touched.note_ar && !!formik.errors.note_ar
                      }
                      helperText={
                        formik.touched.note_ar && formik.errors.note_ar
                      }
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
                      error={
                        !!formik.touched.note_en && !!formik.errors.note_en
                      }
                      helperText={
                        formik.touched.note_en && formik.errors.note_en
                      }
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
                        formik.touched.message_good &&
                        formik.errors.message_good
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
                      }
                    />
                  </Grid>
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

                  <Grid xs={6} md={2}>
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
                  <Grid xs={6} md={2}>
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

                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="لون الخط للصنف"
                      type="color"
                      name="f_color_category"
                      // onChange={formik.handleChange}
                      onChange={(event) => {
                        const hexColor = event.target.value;
                        // const colorString = hexToColorString(hexColor);
                        formik.setFieldValue("f_color_category", hexColor);
                      }}
                      value={formik.values.f_color_category}
                      // value={'#ffffff'}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.f_color_category &&
                        !!formik.errors.f_color_category
                      }
                      helperText={
                        formik.touched.f_color_category &&
                        formik.errors.f_color_category
                      }
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="لون الخط للصنف الفرعي"
                      type="color"
                      name="f_color_sub"
                      // onChange={formik.handleChange}
                      onChange={(event) => {
                        const hexColor = event.target.value;
                        // const colorString = hexToColorString(hexColor);
                        formik.setFieldValue("f_color_sub", hexColor);
                      }}
                      value={formik.values.f_color_sub}
                      // value={'#ffffff'}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.f_color_sub &&
                        !!formik.errors.f_color_sub
                      }
                      helperText={
                        formik.touched.f_color_sub && formik.errors.f_color_sub
                      }
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="لون الخط للعنصر"
                      type="color"
                      name="f_color_item"
                      // onChange={formik.handleChange}
                      onChange={(event) => {
                        const hexColor = event.target.value;
                        // const colorString = hexToColorString(hexColor);
                        formik.setFieldValue("f_color_item", hexColor);
                      }}
                      value={formik.values.f_color_item}
                      // value={'#ffffff'}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.f_color_item &&
                        !!formik.errors.f_color_item
                      }
                      helperText={
                        formik.touched.f_color_item &&
                        formik.errors.f_color_item
                      }
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="لون الخط للتقييم"
                      type="color"
                      name="f_color_rating"
                      // onChange={formik.handleChange}
                      onChange={(event) => {
                        const hexColor = event.target.value;
                        // const colorString = hexToColorString(hexColor);
                        formik.setFieldValue("f_color_rating", hexColor);
                      }}
                      value={formik.values.f_color_rating}
                      // value={'#ffffff'}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.f_color_rating &&
                        !!formik.errors.f_color_rating
                      }
                      helperText={
                        formik.touched.f_color_rating &&
                        formik.errors.f_color_rating
                      }
                    />
                  </Grid>

                  <Grid xs={6} md={2}>
                    <SearchableSelect
                      label=" نوع خط رسالة الترحيب"
                      options={fonts?.data}
                      formik={formik}
                      name="font_type_welcome"
                    />
                  </Grid>

                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.font_size_welcome && !!formik.errors.font_size_welcome
                      }
                    >
                      <InputLabel id="font_size_welcome"> حجم خط رسالة الترحيب</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="font_size_welcome"
                        id="font_size_welcome"
                        label="حجم خط رسالة الترحيب"
                        name="font_size_welcome"
                        value={formik.values.font_size_welcome}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>1em</MenuItem>
                        <MenuItem value={2}>2em</MenuItem>
                        <MenuItem value={3}>3em</MenuItem>
                        <MenuItem value={4}>4em</MenuItem>
                      </Select>
                      {formik.touched.font_size_welcome && formik.errors.font_size_welcome && (
                        <FormHelperText>
                          {formik.errors.font_size_welcome}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.font_size_category && !!formik.errors.font_size_category
                      }
                    >
                      <InputLabel id="font_size_category"> حجم خط الصنف</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="font_size_category"
                        id="font_size_category"
                        label="حجم خط الصنف"
                        name="font_size_category"
                        value={formik.values.font_size_category}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>1em</MenuItem>
                        <MenuItem value={2}>2em</MenuItem>
                        <MenuItem value={3}>3em</MenuItem>
                        <MenuItem value={4}>4em</MenuItem>
                      </Select>
                      {formik.touched.font_size_category && formik.errors.font_size_category && (
                        <FormHelperText>
                          {formik.errors.font_size_category}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.font_bold_category && !!formik.errors.font_bold_category
                      }
                    >
                      <InputLabel id="font_bold_category"> الخط سميك للصنف</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="font_bold_category"
                        id="font_bold_category"
                        label="الخط سميك للصنف"
                        name="font_bold_category"
                        value={formik.values.font_bold_category}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.font_bold_category && formik.errors.font_bold_category && (
                        <FormHelperText>
                          {formik.errors.font_bold_category}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={6} md={2}>
                    <SearchableSelect
                      label="نوع خط الصنف العربي"
                      options={fontsArabic?.data}
                      formik={formik}
                      name="font_type_category_ar"
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <SearchableSelect
                      label="نوع خط الصنف الانجليزي"
                      options={fonts?.data}
                      formik={formik}
                      name="font_type_category_en"
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.font_bold_item && !!formik.errors.font_bold_item
                      }
                    >
                      <InputLabel id="font_bold_item"> الخط سميك للعنصر</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="font_bold_item"
                        id="font_bold_item"
                        label="الخط سميك للعنصر"
                        name="font_bold_item"
                        value={formik.values.font_bold_item}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.font_bold_item && formik.errors.font_bold_item && (
                        <FormHelperText>
                          {formik.errors.font_bold_item}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.font_size_item && !!formik.errors.font_size_item
                      }
                    >
                      <InputLabel id="font_size_item"> حجم خط العنصر</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="font_size_item"
                        id="font_size_item"
                        label="حجم خط العنصر"
                        name="font_size_item"
                        value={formik.values.font_size_item}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>1em</MenuItem>
                        <MenuItem value={2}>2em</MenuItem>
                        <MenuItem value={3}>3em</MenuItem>
                        <MenuItem value={4}>4em</MenuItem>
                      </Select>
                      {formik.touched.font_size_item && formik.errors.font_size_item && (
                        <FormHelperText>
                          {formik.errors.font_size_item}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} md={2}>
                    <SearchableSelect
                      label="نوع خط العنصر العربي"
                      options={fontsArabic?.data}
                      formik={formik}
                      name="font_type_item_ar"
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <SearchableSelect
                      label="نوع خط العنصر الانجليزي"
                      options={fonts?.data}
                      formik={formik}
                      name="font_type_item_en"
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <SearchableSelect
                      label=" نوع الخط الانكليزي"
                      options={fonts?.data}
                      formik={formik}
                      name="font_id_en"
                      margin={'none'}
                      size={'small'}
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <SearchableSelect
                      label=" نوع الخط العربي"
                      options={fontsArabic?.data}
                      formik={formik}
                      name="font_id_ar"
                      margin={'none'}
                      size={'small'}
                    />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.is_welcome_massege && !!formik.errors.is_welcome_massege
                      }
                    >
                      <InputLabel id="is_welcome_massege">صلاحيات تعديل رسائل الترحيب</InputLabel>
                      <Select
                        // size="small"
                        labelId="is_welcome_massege"
                        id="is_welcome_massege"
                        label="صلاحيات تعديل رسائل الترحيب"
                        name="is_welcome_massege"
                        value={formik.values.is_welcome_massege}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.is_welcome_massege && formik.errors.is_welcome_massege && (
                        <FormHelperText>{formik.errors.is_welcome_massege}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.is_taxes && !!formik.errors.is_taxes
                      }
                    >
                      <InputLabel id="is_taxes">عرض الضرائب بالفاتورة</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="is_taxes"
                        id="is_taxes"
                        label="عرض الضرائب بالفاتورة"
                        name="is_taxes"
                        value={formik.values.is_taxes}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.is_taxes && formik.errors.is_taxes && (
                        <FormHelperText>
                          {formik.errors.is_taxes}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {
                    formik.values.is_taxes == 1 &&
                    <>
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
                    </>
                  }
                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.city_id && !!formik.errors.city_id
                      }
                    >
                      <InputLabel id="city_id">المدينة</InputLabel>
                      <Select
                        InputLabelProps={{ shrink: true }}
                        labelId="city_id"
                        id="city_id"
                        name="city_id"
                        label="المدينة"
                        // size="small"
                        value={formik.values.city_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {cities &&
                          cities.data &&
                          cities.data.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {formik.touched.city_id && formik.errors.city_id && (
                        <FormHelperText>{formik.errors.city_id}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.admin_id && !!formik.errors.admin_id
                      }
                    >
                      <InputLabel id="admin_id">مدير المطعم</InputLabel>
                      <Select
                        InputLabelProps={{ shrink: true }}
                        labelId="admin_id"
                        id="admin_id"
                        name="admin_id"
                        label="مدير المطعم"
                        // size="small"
                        value={formik.values.admin_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {managers &&
                          managers.data &&
                          managers.data.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.user_name}
                            </MenuItem>
                          ))}
                      </Select>
                      {formik.touched.admin_id && formik.errors.admin_id && (
                        <FormHelperText>
                          {formik.errors.admin_id}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.menu_template_id &&
                        !!formik.errors.menu_template_id
                      }
                    >
                      <InputLabel id="menu_template_id">Menu</InputLabel>
                      <Select
                        InputLabelProps={{ shrink: true }}
                        labelId="menu_template_id"
                        id="menu_template_id"
                        name="menu_template_id"
                        label="Menu"
                        // size="small"
                        value={formik.values.menu_template_id}
                        onChange={formik.handleChange}
                      >
                        {menus &&
                          menus.data &&
                          menus.data.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {formik.touched.menu_template_id &&
                        formik.errors.menu_template_id && (
                          <FormHelperText>
                            {formik.errors.menu_template_id}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="home_opacity"
                      name="home_opacity"
                      onChange={formik.handleChange}
                      value={formik.values.home_opacity}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.home_opacity &&
                        !!formik.errors.home_opacity
                      }
                      helperText={
                        formik.touched.home_opacity &&
                        formik.errors.home_opacity
                      }
                    />
                  </Grid>

                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.fav_lang && !!formik.errors.fav_lang
                      }
                    >
                      <InputLabel id="fav_lang">اللغة المفضلة</InputLabel>
                      <Select
                        // size="small"
                        labelId="fav_lang"
                        id="fav_lang"
                        label="اللغة المفضلة"
                        name="fav_lang"
                        value={formik.values.fav_lang}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={'ar'}>ar</MenuItem>
                        <MenuItem value={'en'}>en</MenuItem>
                      </Select>
                      {formik.touched.fav_lang && formik.errors.fav_lang && (
                        <FormHelperText>{formik.errors.fav_lang}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.image_or_color && !!formik.errors.image_or_color
                      }
                    >
                      <InputLabel id="image_or_color"> الخلفية عبارة عن صورة</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="image_or_color"
                        id="image_or_color"
                        label="الخلفية عبارة عن صورة"
                        name="image_or_color"
                        value={formik.values.image_or_color}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.image_or_color && formik.errors.image_or_color && (
                        <FormHelperText>
                          {formik.errors.image_or_color}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="rate_opacity"
                      name="rate_opacity"
                      onChange={formik.handleChange}
                      value={formik.values.rate_opacity}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.rate_opacity &&
                        !!formik.errors.rate_opacity
                      }
                      helperText={
                        formik.touched.rate_opacity &&
                        formik.errors.rate_opacity
                      }
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="sub_opacity"
                      name="sub_opacity"
                      onChange={formik.handleChange}
                      value={formik.values.sub_opacity}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.sub_opacity &&
                        !!formik.errors.sub_opacity
                      }
                      helperText={
                        formik.touched.sub_opacity &&
                        formik.errors.sub_opacity
                      }
                    />
                  </Grid>
                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.emoji_id && !!formik.errors.emoji_id
                      }
                    >
                      <InputLabel id="emoji_id">الايموجي</InputLabel>
                      <Select
                        // InputLabelProps={{ shrink: true }}
                        labelId="emoji_id"
                        id="emoji_id"
                        name="emoji_id"
                        label="الايموجي"
                        // size="small"
                        value={formik.values.emoji_id}
                        onChange={formik.handleChange}
                      >
                        {emojis &&
                          emojis.data &&
                          emojis.data.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {formik.touched.emoji_id && formik.errors.emoji_id && (
                        <FormHelperText>
                          {formik.errors.emoji_id}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.is_rate && !!formik.errors.is_rate
                      }
                    >
                      <InputLabel id="is_rate">الاشتراك بالتقييمات</InputLabel>
                      <Select
                        // size="small"
                        labelId="is_rate"
                        id="is_rate"
                        label="الاشتراك بالتقييمات"
                        name="is_rate"
                        value={formik.values.is_rate}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.is_rate && formik.errors.is_rate && (
                        <FormHelperText>{formik.errors.is_rate}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {formik.values.is_rate == 1
                    &&
                    <Grid xs={12} md={4}>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={
                          !!formik.touched.rate_format && !!formik.errors.rate_format
                        }
                      >
                        <InputLabel id="rate_format">شكل التقييم</InputLabel>
                        <Select
                          // InputLabelProps={{ shrink: true }}
                          labelId="rate_format"
                          id="rate_format"
                          name="rate_format"
                          label="شكل التقييم"
                          // size="small"
                          value={formik.values.rate_format}
                          onChange={formik.handleChange}
                        >
                          <MenuItem value={1}>Yes</MenuItem>
                          <MenuItem value={0}>No</MenuItem>
                        </Select>
                        {formik.touched.rate_format && formik.errors.rate_format && (
                          <FormHelperText>
                            {formik.errors.rate_format}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  }
                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.is_order && !!formik.errors.is_order
                      }
                    >
                      <InputLabel id="is_order-label">
                        الاشتراك بالطلبات
                      </InputLabel>
                      <Select
                        // size='small'
                        labelId="is_order-label"
                        id="is_order"
                        label="الاشتراك بالطلبات"
                        name="is_order"
                        value={formik.values.is_order}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.is_order && formik.errors.is_order && (
                        <FormHelperText>
                          {formik.errors.is_order}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.is_table && !!formik.errors.is_table
                      }
                    >
                      <InputLabel id="is_table"> الاشتراك بالطاولات</InputLabel>
                      <Select
                        // size="small"
                        labelId="is_table"
                        id="is_table"
                        label="الاشتراك بالطاولات"
                        name="is_table"
                        value={formik.values.is_table}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.is_table && formik.errors.is_table && (
                        <FormHelperText>
                          {formik.errors.is_table}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.is_sub_move && !!formik.errors.is_sub_move
                      }
                    >
                      <InputLabel id="is_sub_move"> صورة تحريك الأصناف الفرعية</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="is_sub_move"
                        id="is_sub_move"
                        label="صورة تحريك الأصناف الفرعية"
                        name="is_sub_move"
                        value={formik.values.is_sub_move}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.is_sub_move && formik.errors.is_sub_move && (
                        <FormHelperText>
                          {formik.errors.is_sub_move}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.image_or_write && !!formik.errors.image_or_write
                      }
                    >
                      <InputLabel id="image_or_write"> اللوغو مع كتابة</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="image_or_write"
                        id="image_or_write"
                        label="اللوغو مع كتابة"
                        name="image_or_write"
                        value={formik.values.image_or_write}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.image_or_write && formik.errors.image_or_write && (
                        <FormHelperText>
                          {formik.errors.image_or_write}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.price_type && !!formik.errors.price_type
                      }>
                      <InputLabel id="price_type">نوع العملة</InputLabel>
                      <Select
                        // size="small"
                        labelId="price_type"
                        id="price_type"
                        label="نوع العملة"
                        name="price_type"
                        value={formik.values.price_type}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={'syrian'}>syrian</MenuItem>
                        <MenuItem value={'dollar'}>dollar</MenuItem>
                      </Select>
                      {formik.touched.price_type && formik.errors.price_type && (
                        <FormHelperText>{formik.errors.price_type}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.logo_shape && !!formik.errors.logo_shape
                      }
                    >
                      <InputLabel id="logo_shape"> شكل اللوغو</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="logo_shape"
                        id="logo_shape"
                        label="شكل اللوغو"
                        name="logo_shape"
                        value={formik.values.logo_shape}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>circle</MenuItem>
                        <MenuItem value={2}>Rectangle</MenuItem>
                        <MenuItem value={3}>Square</MenuItem>
                      </Select>
                      {formik.touched.logo_shape && formik.errors.logo_shape && (
                        <FormHelperText>
                          {formik.errors.logo_shape}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.is_takeout && !!formik.errors.is_takeout
                      }
                    >
                      <InputLabel id="is_takeout"> خدمة طلبات خارجية</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="is_takeout"
                        id="is_takeout"
                        label="خدمة طلبات خارجية"
                        name="is_takeout"
                        value={formik.values.is_takeout}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.is_takeout && formik.errors.is_takeout && (
                        <FormHelperText>
                          {formik.errors.is_takeout}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.is_delivery && !!formik.errors.is_delivery
                      }
                    >
                      <InputLabel id="is_delivery"> خدمة توصيل</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="is_delivery"
                        id="is_delivery"
                        label="خدمة توصيل "
                        name="is_delivery"
                        value={formik.values.is_delivery}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.is_delivery && formik.errors.is_delivery && (
                        <FormHelperText>
                          {formik.errors.is_delivery}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.accepted_by_waiter && !!formik.errors.accepted_by_waiter
                      }
                    >
                      <InputLabel id="accepted_by_waiter"> قبول الطلب من قبل النادل</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="accepted_by_waiter"
                        id="accepted_by_waiter"
                        label="قبول الطلب من قبل النادل"
                        name="accepted_by_waiter"
                        value={formik.values.accepted_by_waiter}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.accepted_by_waiter && formik.errors.accepted_by_waiter && (
                        <FormHelperText>
                          {formik.errors.accepted_by_waiter}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.empty_image && !!formik.errors.empty_image
                      }
                    >
                      <InputLabel id="empty_image"> الصورة مفرغة</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="empty_image"
                        id="empty_image"
                        label="الصورة مفرغة"
                        name="empty_image"
                        value={formik.values.empty_image}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.empty_image && formik.errors.empty_image && (
                        <FormHelperText>
                          {formik.errors.empty_image}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={6} md={2}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={
                        !!formik.touched.share_item_whatsapp && !!formik.errors.share_item_whatsapp
                      }
                    >
                      <InputLabel id="share_item_whatsapp"> مشاركة صورة العنصر</InputLabel>
                      <Select
                        // size="small"
                        fullWidth
                        labelId="share_item_whatsapp"
                        id="share_item_whatsapp"
                        label="مشاركة صورة العنصر"
                        name="share_item_whatsapp"
                        value={formik.values.share_item_whatsapp}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={1}>Yes</MenuItem>
                        <MenuItem value={0}>No</MenuItem>
                      </Select>
                      {formik.touched.share_item_whatsapp && formik.errors.share_item_whatsapp && (
                        <FormHelperText>
                          {formik.errors.share_item_whatsapp}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid xs={12} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="message in home page"
                      name="message_in_home_page"
                      onChange={formik.handleChange}
                      value={formik.values.message_in_home_page}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.message_in_home_page &&
                        !!formik.errors.message_in_home_page
                      }
                      helperText={
                        formik.touched.message_in_home_page &&
                        formik.errors.message_in_home_page
                      }
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="latitude"
                      name="latitude"
                      onChange={formik.handleChange}
                      value={formik.values.latitude}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.latitude &&
                        !!formik.errors.latitude
                      }
                      helperText={
                        formik.touched.latitude && formik.errors.latitude
                      }
                    />
                  </Grid>
                  <Grid xs={6} md={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      label="longitude"
                      name="longitude"
                      onChange={formik.handleChange}
                      value={formik.values.longitude}
                      onBlur={formik.handleBlur}
                      error={
                        !!formik.touched.longitude &&
                        !!formik.errors.longitude
                      }
                      helperText={
                        formik.touched.longitude && formik.errors.longitude
                      }
                    />
                  </Grid>
                </Grid>
              </div>
            </div>
          </ThemeProvider>
        </Box>

        <Box mt={3}>
          <Button
            variant="outlined"
            sx={{ marginRight: "5px" }}
            onClick={() => navigate(-1)}
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

        <ToastContainer />
      </form>
    </div>
  );
};

export default AddRest;
