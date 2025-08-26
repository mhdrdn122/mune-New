import { TextField, Unstable_Grid2 as Grid, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import notify from "../../../utils/useNotification";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import React, { useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import {
  getAdminDetailsAction,
  resetupdatedProfile,
  updateProfileAction,
} from "../../../redux/slice/auth/authSlice";
 import { usePermissions } from "../../../context/PermissionsContext";
import useGetStyle from "../../../hooks/useGetStyle";

const ProfileDetails = () => {
  const { hasPermission } = usePermissions();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, updatedDetails } = useSelector(
    (state) => state.auth.updatedProfile
  );
  const { details } = useSelector((state) => state.auth.adminDetails);
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const temp = adminInfo?.token;
    const { Color } = useGetStyle();
  

  const formik = useFormik({
    initialValues: {
      name: adminInfo.name,
      user_name: adminInfo.user_name,
      password: "",
    },
    onSubmit: async (values) => {
      console.log(JSON.stringify(values));
      if (values.password === "") delete values.password;
      await dispatch(updateProfileAction(values));
    },
    validationSchema: Yup.object({
      // user_name: Yup.string().required("Required"),
      // password: Yup.string().required("Required"),
    }),
  });

  useEffect(() => {
    if (!loading) {
      console.log(updatedDetails);
      if (updatedDetails?.status) {
        notify(updatedDetails.message, "success");
        dispatch(resetupdatedProfile());
        const updatedDataWithToken = { ...updatedDetails.data, token: temp };
        localStorage.setItem("adminInfo", JSON.stringify(updatedDataWithToken));
      } else if (error) {
        notify(error.message, "error");
        dispatch(resetupdatedProfile());
        formik.resetForm();
      }
    }
  }, [loading, updatedDetails, error, dispatch]);

  useEffect(() => {
    console.log(details.data);
    // setData(details.data);
  }, [details]);

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { border:   `2px solid ${ Color ? Color :"#2F4B26" }`, borderRadius: "999px" },
      "&:hover fieldset": { borderColor: Color ? Color :"#2F4B26" },
      "&.Mui-focused fieldset": { borderColor: Color ? Color :"#2F4B26" },
    },
    // backgroundColor: '#818360',
    color: Color ? Color :"#2F4B26",
    "& .MuiInputBase-input": { color: Color ? Color :"#2F4B26", padding: "15px 20px" },
    "& .MuiInputLabel-root": { color: Color ? Color :"#2F4B26" },
    // '& .MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.75)', backgroundColor: '#818360', padding: '0 5px' },
    "& .Mui-error": { color: "#ff0000" },
  };

  const fields = [
    { name: "name", label: "الاسم", icon: <PersonIcon /> },
    { name: "user_name", label: "اسم المستخدم", icon: <AccountCircleIcon /> },
    {
      name: "password",
      label: "كلمة السر",
      type: "password",
      icon: <LockIcon />,
    },
  ];

  return (
    <div
      className="text-center"
      style={{
        backgroundColor: "rgba(220, 220, 220, 0.3)",
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid #000",
      }}
    >
      <h2 style={{
        color :Color ? Color :"#2F4B26",
        fontWeight:900
      }} className="my-4"> تعديل الملف الشخصي</h2>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={3}
          sx={{ paddingTop: "25px" }}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto"
        >
          {fields.map(({ name, label, type = "text", icon }) => (
            <Grid xs={12} key={name}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                label={label}
                name={name}
                type={type}
                onChange={formik.handleChange}
                value={formik.values[name]}
                onBlur={formik.handleBlur}
                error={!!formik.touched[name] && !!formik.errors[name]}
                helperText={formik.touched[name] && formik.errors[name]}
                sx={inputSx}
                InputProps={{
                  startAdornment: React.cloneElement(icon, {
                    sx: { color: "#2F4B26", m: "8px" },
                  }),
                }}
              />
            </Grid>
          ))}
        </Grid>

       <Box mt={3} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            sx={{ marginRight: "5px", color: 'red', borderColor: 'red', '&:hover': { color: 'darkred', borderColor: 'darkred' } }}
            onClick={() => navigate(-1)}
          >
            تجاهل
          </Button>

          {loading ? (
            <Button
              variant="outlined"
              sx={{ color: "#fff", background: "red", '&:hover': { background: 'darkred', border: '1px solid darkred' } }}
            >
              <Spinner className="m-auto" animation="border" role="status" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="outlined"
              sx={{ color: "#fff", background: "red", '&:hover': { background: 'darkred', border: '1px solid darkred' } }}
            >
              حفظ
            </Button>
          )}
        </Box>
        <ToastContainer />
      </form>
    </div>
  );
};

export default ProfileDetails;
