import { Navigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionsContext";

const ProtectedRoute = ({ permission, children }) => {
  const { hasPermission } = usePermissions();
  let authSuper = JSON.parse(localStorage.getItem("superAdminInfo"));
  let authAdmin = JSON.parse(localStorage.getItem("adminInfo"));

  if (!hasPermission(permission)) {
    if (authSuper?.token) {
      return <Navigate to="/super_admin" />;
    } else if (authAdmin?.token) {
      return <Navigate to="/admin" />; // Redirect to a default page if permission is not granted
    }
  }

  return children;
};

export default ProtectedRoute;
