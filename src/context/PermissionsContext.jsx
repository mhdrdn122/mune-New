import { createContext, useContext, useRef, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(JSON.parse(localStorage.getItem('permissions')) || []);
  const navigate = useNavigate();
  // console.log(permissions)

  // Check if the user has a specific permission
  const hasPermission = (permissionName) => {
    return permissions?.some((permission) => permission.name === permissionName);
  };

  // Check if the user has at least one permission from a list of permissions
  const hasAnyPermission = (permissionNames) => {
    console.log(permissionNames);
    if (!Array.isArray(permissionNames)) {
      console.error("permissionNames should be an array");
      return false;
    }
    return permissionNames.some((permission) =>
      permissions.includes(permission)
    );
  };
  
  return (
    <PermissionsContext.Provider
      value={{ hasPermission, hasAnyPermission, navigate, setPermissions }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
