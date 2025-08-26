/**
 * File: LoginPage.js
 * Description:
 * - This component handles the admin login functionality.
 * - It verifies credentials, dispatches login actions, and redirects users based on permissions.
 */

import "./LoginPage.css";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ToastContainer } from "react-toastify";
import notify from "../../../utils/useNotification";
// import logo from "../../../assets/logo";
import { useDispatch, useSelector } from "react-redux";
import {
  loginAdminAction,
  resetLogin,
} from "../../../redux/slice/auth/authSlice";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../context/PermissionsContext";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

/**
 * LoginPage Component
 * @component
 * @returns {JSX.Element}
 */ 
const LoginPage = () => {
  const [language, setLanguage] = useState("ar"); // Default language is Arabic
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPress, setIsPress] = useState(true);

  const dispatch = useDispatch();
  const [, setPermissionsInLocalStorage] = useLocalStorage("permissions", []);
  const navigate = useNavigate();
  const { setPermissions } = usePermissions();
  const { loading, adminAuth } = useSelector((state) => state.auth);

  // Handlers for input fields
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  /**
   * Handles form submission
   * - Validates input
   * - Dispatches login action
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      notify("Password must be at least 8 characters long", "error");
      return;
    }
    setIsPress(true);
   
    await dispatch(loginAdminAction({ user_name, password }));
    setIsPress(false);
  };
   /**
   * Handles login success/failure and redirects user
   */
  useEffect(() => {
    if (!isPress && !loading) {
      if (adminAuth?.adminInfo && Object.keys(adminAuth?.adminInfo).length > 0) {
        localStorage.setItem("adminInfo", JSON.stringify(adminAuth?.adminInfo));
        localStorage.setItem("selected", "الأصناف");
        const permissions = adminAuth?.adminInfo?.permissions;
        if (permissions) {
          setPermissions(permissions);
          setPermissionsInLocalStorage(permissions);
        }
        notify("تم تسجيل الدخول بنجاح", "success");
        setUsername("");
        setPassword("");
        setTimeout(() => {
          if (
            adminAuth.adminInfo?.token &&
            adminAuth?.adminInfo?.permissions.some(
              (item) => item.name === "my_restaurants"
            )
          ) {
            navigate("/admin/rests");
          } else {
            navigate("/admin");
          }
        }, 1500);
      } else {
        if (adminAuth?.error) {
          notify(adminAuth?.error?.message, "error");
        }
      }
    }
  }, [loading, isPress]);

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    if (adminAuth.adminInfo?.token) {
      setTimeout(() => {
        navigate("/admin");
        localStorage.setItem("selected", "الأصناف");
      }, 1000);
    }
  }, []);

  return (
    <div className="login_container container-fluid">
      <Row style={{ minHeight: "100vh" }}>
        {/* Left Side Logo */}
        <Col sm={12} lg={6} className="d-flex align-items-center justify-content-center">
          <img src={"../../../assets/logo.png"} alt="logo" className="logo_left" />
        </Col>

        {/* Right Side Form */}
        <Col sm={12} lg={6} className="d-flex align-items-center justify-content-around">
          <Form className="form_login" onSubmit={onSubmit}>
            <h3 className="mb-5">
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </h3>

            {/* Username Field */}
            <Form.Group as={Row} className="mb-3 justify-content-center w-100">
              <Col>
                <Form.Control
                  type="text"
                  placeholder={language === "ar" ? "اسم المستخدم" : "username"}
                  value={user_name}
                  onChange={onChangeUsername}
                  dir={language === "ar" ? "rtl" : "ltr"}
                  required
                />
              </Col>
            </Form.Group>

            {/* Password Field with Visibility Toggle */}
            <Form.Group as={Row} className="mb-3 justify-content-center w-100 position-relative">
              <Col>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder={language === "ar" ? "كلمة المرور" : "Password"}
                  value={password}
                  onChange={onChangePassword}
                  dir={language === "ar" ? "rtl" : "ltr"}
                  required
                  className="pr-5"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "90%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </Col>
            </Form.Group>

            {/* Submit Button */}
            {loading ? (
              <button className="mt-5" type="button">
                <Spinner className="m-auto" animation="border" role="status" />
              </button>
            ) : (
              <button className="mt-5" type="submit">
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </button>
            )}
          </Form>
        </Col>
      </Row>

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
