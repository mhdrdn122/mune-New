import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {} from "../../../redux/slice/categories/categoriesSlice";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
import {
  useAddNewAdminMutation,
  useGetPermissonsQuery,
  useGetRolesQuery,
} from "../../../redux/slice/super_admin/super_admins/superAdminsApi";
import { getAllCitiesAction } from "../../../redux/slice/super_admin/city/citySlice";
import useError401 from "../../../hooks/useError401 ";
// import { useGetRolesQuery } from "../../../redux/slice/admins/adminsApi";

const ModalAddAdmin = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [
    addNewAdmin,
    { isLoading: isLoadingAdd, isSuccess, isError, error: errorAdd },
  ] = useAddNewAdminMutation();
  const { data: perrmissons } = useGetPermissonsQuery(undefined, {
    skip: !show,
  });
  const {
    data: roles,
    isError: isErrorRoles,
    error: errorRoles,
  } = useGetRolesQuery(undefined, { skip: !show });

  const { cities, loading, error, status } = useSelector(
    (state) => state.citySuper
  );

  const { triggerRedirect } = useError401(isErrorRoles, errorRoles);

  useEffect(() => {
    if (perrmissons?.length > 0) {
      const res = perrmissons?.map((item) => item.name);
      formik.setFieldValue("permission", res);
    }
  }, [perrmissons]);

  const formik = useFormik({
    initialValues: {
      name: "",
      user_name: "",
      email:"",
      password: "",
      city_id: "",
      role: "",
      permission: [],
    },
    onSubmit: async (values) => {
      console.log(JSON.stringify(values));
      if (values.city_id === "All Cities") {
        values.city_id = "";
      }
      const result = await addNewAdmin(values).unwrap();
      console.log(result);
      // if (result.status === true) {
      //   notify(result.message, "success");
      //   handleClose();
      //   formik.resetForm();
      // }
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      user_name: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      // city_id: Yup.string().required(" Required"),
      role: Yup.string().required(" Required"),
      permission: Yup.array().min(1, "required"),
    }),
  });

  useEffect(() => {
    if (!isLoadingAdd && isSuccess) {
      notify("Added successfully", "success");
      handleClose();
      formik.resetForm();
    }
  }, [isSuccess, isLoadingAdd]);

  useEffect(() => {
    if (isError) {
      console.error("Failed to add service:", errorAdd);
      if (errorAdd.status === "FETCH_ERROR") {
        notify("No Internet Connection", "error");
      } else if (errorAdd.status === 401) {
        triggerRedirect();
      } else {
        notify(errorAdd.data.message, "error");
        // const backendErrors = errorAdd.data.errors;
        // const formattedErrors = {};
        // for (const key in backendErrors) {
        //   formattedErrors[key] = backendErrors[key][0];
        // }
        // console.log(formattedErrors);
        // formik.setErrors(formattedErrors);
        formik.setErrors(errorAdd.data?.errors || {});
      }
    }
  }, [isError, errorAdd]);
  
  // Custom handler for changing permission selection
  const handlePermissionChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue(
      "permission",
      typeof value === "string" ? value.split(",") : value
    );
  };
  function getStyles(name, personName, theme) {
    return {
      fontWeight: personName?.indexOf(name) === -1 ? 400 : 700,
    };
  }

  const fetchData = async () => {
    await dispatch(getAllCitiesAction(""));
  };
  useEffect(() => {
    if (status === "idle") {
      fetchData();
    }
  }, [status]);

  useEffect(() => {
    formik.resetForm();
    if (perrmissons?.length > 0) {
      const res = perrmissons?.map((item) => item.name);
      formik.setFieldValue("permission", res);
    }
  }, [handleClose]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>إضافة مشرف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box
            m="40px 0 0 0"
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, 1fr)" // تعديل هنا لتكون 4 أعمدة
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              margin="dense"
              id="name"
              name="name"
              label="الاسم"
              type="text"
              fullWidth
              sx={{ gridColumn: "span 2" }}
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              error={!!formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
              dir="rtl"
            />
            <TextField
              margin="dense"
              id="user_name"
              name="user_name"
              label="اسم المستخدم"
              type="text"
              fullWidth
              sx={{ gridColumn: "span 2" }}
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user_name}
              error={!!formik.touched.user_name && !!formik.errors.user_name}
              helperText={formik.touched.user_name && formik.errors.user_name}
            />

            <TextField
              margin="dense"
              id="email"
              name="email"
              label="البريد الالكتروني "
              type="text"
              fullWidth
              sx={{ gridColumn: "span 2" }}
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={!!formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              margin="dense"
              id="password"
              name="password"
              label="كلمة السر"
              type="password"
              fullWidth
              sx={{ gridColumn: "span 2" }}
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={!!formik.touched.password && !!formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />

            <FormControl
              variant="outlined"
              fullWidth
              margin="dense"
              sx={{ gridColumn: "span 2" }}
              error={!!formik.touched.city_id && !!formik.errors.city_id}
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
                // error={!!formik.touched.city_id && !!formik.errors.city_id}
              >
                <MenuItem value={"All Cities"}>{"All Cities"}</MenuItem>
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
            <FormControl
              variant="outlined"
              fullWidth
              margin="dense"
              sx={{ gridColumn: "span 2" }}
              error={!!formik.touched.role && !!formik.errors.role}
            >
              <InputLabel id="role">role</InputLabel>
              <Select
                InputLabelProps={{ shrink: true }}
                labelId="role"
                id="role"
                name="role"
                label="role"
                // size="small"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {roles &&
                  roles.map((role) => (
                    <MenuItem
                      key={role.name}
                      value={role.name}
                      style={getStyles(role.name, formik.values.roles, theme)}
                    >
                      {role.name}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.role && formik.errors.role && (
                <FormHelperText>{formik.errors.role}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              variant="outlined"
              fullWidth
              margin="dense"
              sx={{ gridColumn: "span 2" }}
              error={!!formik.touched.permission && !!formik.errors.permission}
            >
              <InputLabel id="permission">Permission</InputLabel>
              <Select
                InputLabelProps={{ shrink: true }}
                labelId="permission"
                id="permission"
                name="permission"
                multiple
                label="Permission"
                value={formik.values.permission}
                onChange={handlePermissionChange}
                onBlur={formik.handleBlur}
              >
                {perrmissons &&
                  perrmissons.map((per) => (
                    <MenuItem
                      key={per.name}
                      value={per.name}
                      style={getStyles(
                        per.name,
                        formik.values.permission,
                        theme
                      )}
                    >
                      {per.name}
                    </MenuItem>
                  ))}
              </Select>
              {formik.touched.permission && formik.errors.permission && (
                <FormHelperText>{formik.errors.permission}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            className="mx-2"
            onClick={() => {
              handleClose();
              formik.resetForm();
            }}
          >
            تجاهل
          </Button>

          {isLoadingAdd === true ? (
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
  );
};

export default ModalAddAdmin;
