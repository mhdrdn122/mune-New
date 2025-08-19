import { TextField, Unstable_Grid2 as Grid, Box, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import notify from "../../../utils/useNotification";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

import {
  getAdminDetailsAction,
  resetupdatedProfile,
  updateProfileAction,
} from "../../../redux/slice/auth/authSlice";
import { PermissionsEnum } from "../../../constant/permissions";
import { usePermissions } from "../../../context/PermissionsContext";

const ProfileDetails = () => {
  const { hasPermission } = usePermissions();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, updatedDetails } = useSelector(
    (state) => state.auth.updatedProfile
  );
  const { details } = useSelector((state) => state.auth.adminDetails);

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  const formik = useFormik({
    initialValues: {
      name: adminInfo.name,
      user_name: adminInfo.user_name,
      password: "",
    },
    onSubmit: async (values) => {
      console.log(JSON.stringify(values));
      if (values.password === "") {
        delete values.password;
      }

      await dispatch(updateProfileAction(values));
    },
    validationSchema: Yup.object({
      // user_name: Yup.string().required("Required"),
      // password: Yup.string().required("Required"),
    }),
  });

  console.log(error);
  console.log(JSON.parse(localStorage.getItem("adminInfo")).token);
  const temp = JSON.parse(localStorage.getItem("adminInfo")).token;

  useEffect(() => {
    if (loading === false) {
      console.log(updatedDetails);
      if (updatedDetails.status === true) {
        notify(updatedDetails.message, "success");
        dispatch(resetupdatedProfile());
        const updatedDataWithToken = {
          ...updatedDetails?.data,
          token: temp,
        };
        localStorage.setItem("adminInfo", JSON.stringify(updatedDataWithToken));
      } else {
        notify(error?.message, "error");
        dispatch(resetupdatedProfile());
        formik.resetForm();
      }
    }
  }, [loading]);

  console.log(details.data);
  useEffect(() => {
    // setData(details.data);
  }, [details]);

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
          </Box>
        }
        <ToastContainer />
      </form>
    </div>
  );
};

export default ProfileDetails;
