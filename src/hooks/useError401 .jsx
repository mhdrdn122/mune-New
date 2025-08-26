import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useError401 = (isError, error) => {
  const navigate = useNavigate();
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    if ((isError && error?.status === 401) || redirectToLogin) {
      // console.error("Unauthorized access detected. Redirecting to login.");
      localStorage.clear();
      navigate("/super_admin/login"); // Redirect to login page
    }
  }, [isError, error, redirectToLogin, navigate]);

  // Public API to set redirection manually
  const triggerRedirect = () => setRedirectToLogin(true);

  return { triggerRedirect };
};

export default useError401;
