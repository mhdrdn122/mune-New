import { TextField, Unstable_Grid2 as Grid, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import notify from "../../../utils/useNotification";
import { useDispatch } from "react-redux";
import { resetUpdateProfileState, updateSuperAdminAction } from "../../../redux/slice/super_admin/auth/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { Value } from "sass";
import { SuperPermissionsEnum } from "../../../constant/permissions";
import { usePermissions } from "../../../context/PermissionsContext";

const ProfileData = () => {
  const { hasPermission } = usePermissions();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, data } = useSelector(
    (state) => state.authSuper.updatedProfile
  );

  const superAdminInfo = JSON.parse(localStorage.getItem("superAdminInfo"));

  const formik = useFormik({
    initialValues: {
      name: superAdminInfo.name,
      user_name: superAdminInfo.user_name,
      password: "",
    },
    onSubmit: async (values) => {
      console.log(JSON.stringify(values));
      if(values.password === ""){
        delete values.password
      }
      await dispatch(updateSuperAdminAction(values));
    },
    validationSchema: Yup.object({
      // user_name: Yup.string().required("Required"),
      // password: Yup.string().required("Required"),
    }),
  });

  const temp = JSON.parse(localStorage.getItem("superAdminInfo")).token
  console.log(data)

  useEffect(()=>{
    if(loading === false){
      console.log(data)
      if(data.status === true){
        notify(data.message, 'success')
        dispatch(resetUpdateProfileState())
        const updatedDataWithToken = {
          ...data?.data,
          token: temp,
        };
        localStorage.setItem(
          "superAdminInfo",
          JSON.stringify(updatedDataWithToken)
        );
      }else {
        notify(data.message, 'error')
        dispatch(resetUpdateProfileState())
      }
    }
  },[loading])

  return (
    <div>
      <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
        <Grid
          container
          spacing={3}
          sx={{ paddingTop: "25px" }}
          flexDirection={"column"}
          alignItems={"end"}
        >
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              label=" الاسم"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              error={!!formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid xs={12} md={6}>
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
              error={!!formik.touched.user_name && !!formik.errors.user_name}
              helperText={formik.touched.user_name && formik.errors.user_name}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              label="كلمة السر"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              error={!!formik.touched.password && !!formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
        </Grid>

        {
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
        </Box>}
        <ToastContainer />
      </form>
    </div>
  );
};

export default ProfileData;
