import { Outlet, Navigate } from 'react-router-dom'
import { resetAuthState } from '../../redux/slice/super_admin/auth/authSlice';
import { useDispatch } from 'react-redux';

const SuperAdminPrivateRoutes = () => {
  const dispatch = useDispatch()
  let auth = JSON.parse(localStorage.getItem('superAdminInfo'))
  // console.log(auth.token.token)
  // console.log(auth.token)
  const handleLogout = async () => {
    await dispatch(resetAuthState());
  };
  if (!auth) {
    handleLogout();
  }
    return(
        auth?.token ? <Outlet/> : <Navigate to="/super_admin/login"/>
    )
}

export default SuperAdminPrivateRoutes
