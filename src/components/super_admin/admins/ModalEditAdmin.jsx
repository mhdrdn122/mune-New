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
  useGetPermissonsQuery,
  useShowOneAdminQuery,
  useUpdateAdminMutation,
  useGetRolesQuery,
} from "../../../redux/slice/super_admin/super_admins/superAdminsApi";
import { getAllCitiesAction } from "../../../redux/slice/super_admin/city/citySlice";
import useError401 from "../../../hooks/useError401 ";

const ModalEditAdmin = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [details, setDetails] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [
    updateAdmin,
    { isLoading: isLoadingAdd, isSuccess, isError, error: errorAdd },
  ] = useUpdateAdminMutation();
  
  const { data: perrmissons } = useGetPermissonsQuery(undefined, {
    skip: !show,
  });

  
  const { data: roles } = useGetRolesQuery(undefined, { skip: !show });

  const {
    data: oneAdmin,
    isLoading: loading,
    isSuccess: isSuccessShowOne,
  } = useShowOneAdminQuery(show, { skip: !show });

  const { triggerRedirect } = useError401(isError, errorAdd);

  const { cities, status } = useSelector((state) => state.citySuper);
  useEffect(() => {
    if (!loading && isSuccessShowOne) {
      console.log(oneAdmin);

      formik.resetForm({
        values: {
          id: oneAdmin?.data?.id,
          name: oneAdmin?.data?.name,
          user_name: oneAdmin?.data.user_name,
          email: oneAdmin?.data.email,
          city_id: oneAdmin?.data?.city_id,
          role: oneAdmin?.data?.roles,
          permission: oneAdmin?.data?.permissions?.map((item) => item.name),
        },
      });
    }
  }, [loading, oneAdmin]);

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      user_name: "",
      email:"",
      city_id: "",
      role: "",
      permission: [],
    },
    // enableReinitialize:true,
    onSubmit: async (values) => {
      console.log(JSON.stringify(values));
      if (values.city_id === "All Cities") {
        values.city_id = "";
      }
      const result = await updateAdmin(values).unwrap();
      console.log(result);
      if (result.status === true) {
        notify(result.message, "success");
        handleClose();
        formik.resetForm();
      }
    },
    validationSchema: Yup.object({
     
    }),
  });

  useEffect(() => {
    if (isError) {
      console.error("Failed to add service:", errorAdd);
      if (errorAdd.status === "FETCH_ERROR") {
        notify("No Internet Connection", "error");
      } else if (errorAdd.status === 401) {
        triggerRedirect();
      } else {
        notify(errorAdd.data.message, "error");
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

  // const fetchData = async () => {
  //   await dispatch(getAllCitiesAction(""));
  // };
  // useEffect(() => {
  //   fetchData();
  // }, [dispatch]);

  const fetchData = async () => {
    await dispatch(getAllCitiesAction(""));
  };
  useEffect(() => {
    if (status === "idle") {
      fetchData();
    }
  }, [status]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>تعديل مشرف</Modal.Title>
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
            

            <FormControl
              variant="outlined"
              fullWidth
              margin="dense"
              sx={{ gridColumn: "span 4" }}
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
                // error={!!formik.touched.role && !!formik.errors.role}
              >
                {
                  // <MenuItem value={"admin"}> admin </MenuItem>
                  // <MenuItem value={"employee "}> employee </MenuItem>
                  // <MenuItem value={"dataEntry "}> dataEntry </MenuItem>
                }

                {roles &&
                  roles.map((role) => (
                    <MenuItem
                      key={role.name}
                      value={role.name}
                      style={getStyles(role.name, formik.values.role, theme)}
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

export default ModalEditAdmin;
