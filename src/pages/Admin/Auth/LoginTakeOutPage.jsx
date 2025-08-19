/**
 * File: LoginTakeOutPage.js
 * Description:
 * - This file handles the login functionality for users accessing the admin or takeout supervisor panel.
 * - It performs form validation, dispatches login requests, handles permissions, and navigates users based on their roles.
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
// import { onMessageListener, requestPermission } from "../../../firebase";
import toast, { Toaster } from "react-hot-toast";

/**
 * LoginTakeOutPage Component
 * @component
 * @returns {JSX.Element}
 */
const LoginTakeOutPage = () => {
  const [language, setLanguage] = useState("ar"); // Interface language (default: Arabic)
  const [user_name, setUsername] = useState("");  // Username field
  const [password, setPassword] = useState("");   // Password field
  const [isPress, setIsPress] = useState(true);   // Track submit state
  const [resLogin, setResLogin] = useState([]);   // (Optional) result response array

  const dispatch = useDispatch();
  const [, setPermissionsInLocalStorage] = useLocalStorage("permissions", []);
  const navigate = useNavigate();
  const { setPermissions } = usePermissions();

  // Handle username input
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  // Handle password input
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  /**
   * Handle login form submission
   * - Validates inputs
   * - Dispatches login action
   */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (user_name === "") {
      notify("Please Enter username", "error");
      return;
    } else if (!password) {
      notify("Please Enter Password", "error");
      return;
    } else if (password.length < 8) {
      notify("Password must be at least 8 characters long", "error");
      return false;
    }

    setIsPress(true);
    await dispatch(
      loginAdminAction({
        user_name,
        password,
        // fcm_token
      })
    );
    setIsPress(false);
  };

  // Select store data from Redux
  const { loading, adminAuth } = useSelector((state) => state.auth);
  console.log("adminAuth : ", adminAuth);

  /**
   * Effect:
   * - Handles redirect after successful login.
   * - Stores auth info and permissions in localStorage.
   */
  useEffect(() => {
    if (!isPress && !loading) {
      if (
        adminAuth?.adminInfo &&
        Object.keys(adminAuth?.adminInfo).length > 0
      ) {
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
            navigate("/admin/takeoutsupervisor");
          }
        }, 1500);
      } else {
        if (adminAuth?.error) {
          notify(adminAuth?.error?.message, "error");
        }
      }
    }
  }, [loading, isPress]);

  /**
   * UI rendering section
   * - Displays login form with username/password inputs.
   * - Shows loading spinner or submit button.
   */
  return (
    <div className="login_container container-fluid">
      <Row style={{ minHeight: "100vh" }}>
        {/* Left column with logo */}
        <Col sm={12} lg={6} className="d-flex align-items-center justify-content-center">
          <img src={"../../../assets/logo.png"} alt="logo" className="logo_left" />
        </Col>

        {/* Right column with login form */}
        <Col sm={12} lg={6} className="d-flex align-items-center justify-content-around">
          <Form className="form_login" onSubmit={onSubmit}>
            <h3 className="mb-5">
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </h3>

            {/* Username field */}
            <Form.Group as={Row} className="mb-3 justify-content-center w-100">
              <Col>
                <Form.Control
                  type="text"
                  placeholder={language === "ar" ? "اسم المستخدم" : "username"}
                  value={user_name}
                  onChange={onChangeUsername}
                  dir={language === "ar" ? "rtl" : "ltr"}
                />
              </Col>
            </Form.Group>

            {/* Password field */}
            <Form.Group as={Row} className="mb-3 justify-content-center w-100">
              <Col>
                <Form.Control
                  type="password"
                  placeholder={language === "ar" ? "كلمة المرور" : "password"}
                  value={password}
                  onChange={onChangePassword}
                  lang="ar"
                  dir={language === "ar" ? "rtl" : "ltr"}
                />
              </Col>
            </Form.Group>

            {/* Submit or loading spinner */}
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

export default LoginTakeOutPage;
