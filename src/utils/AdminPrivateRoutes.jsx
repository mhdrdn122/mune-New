import { Outlet, Navigate } from "react-router-dom";
import { resetAuthState } from "../redux/slice/auth/authSlice";
import { useDispatch } from "react-redux";

const AdminPrivateRoutes = () => {
  const dispatch = useDispatch();
  // let auth = {'token': localStorage.getItem('adminInfo')}
  let auth = JSON.parse(localStorage.getItem("adminInfo"));
  // let authSuper = JSON.parse(localStorage.getItem('superAdminInfo'))
  // console.log(authSuper.token)

  
  const handleLogout = async () => {
    await dispatch(resetAuthState());
  };
  if (!auth) {
    handleLogout();
  }
  return auth?.token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoutes;
