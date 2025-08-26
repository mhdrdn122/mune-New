import "./Login.css";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ToastContainer } from "react-toastify";
// import { useInsertData } from "../../../hooks/useInsertData";
import notify from "../../../utils/useNotification";
// import logo from "../../../assets/logo";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminAction } from "../../../redux/slice/auth/authSlice";
import { loginSuperAdminAction } from "../../../redux/slice/super_admin/auth/authSlice";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../context/PermissionsContext";
  
const Login = () => {
  const [language, setLanguage] = useState("ar");
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [loading, setloading] = useState(true);
  const [isPress, setIsPress] = useState(true);
  const dispatch = useDispatch();
  const [,setPermissionsInLocalStorage] = useLocalStorage("permissions", []);
  const navigate = useNavigate();
  const { setPermissions } = usePermissions()

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

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
      loginSuperAdminAction({
        user_name,
        password,
      })
    );
    setIsPress(false);
  };

  //select store data
  const { loading, superAdminAuth, status } = useSelector(
    (state) => state.authSuper
  );
 
  useEffect(() => {
    if (!isPress && loading === false) {
      console.log("inside useEffect");
      if (
        superAdminAuth?.superAdminInfo &&
        Object.keys(superAdminAuth?.superAdminInfo).length > 0
      ) {
        localStorage.setItem(
          "superAdminInfo",
          JSON.stringify(superAdminAuth?.superAdminInfo)
        );
        // console.log(superAdminAuth?.superAdminInfo?.permissions)
        // setPermissions(superAdminAuth?.superAdminInfo?.permissions);
        const permissions = superAdminAuth?.superAdminInfo?.permissions;
        if (permissions) {
          setPermissions(permissions)
          setPermissionsInLocalStorage(permissions)
        }
        notify("تم تسجيل الدخول بنجاح", "success");
        setUsername("");
        setPassword("");
      } else {
        notify(superAdminAuth?.error?.message, "error");
      }

      if (superAdminAuth?.superAdminInfo?.token) {
        setTimeout(() => {
          navigate("/super_admin");
        }, 1000);
      }
    }
  }, [loading, isPress]);

  useEffect(() => {
    if (superAdminAuth?.superAdminInfo?.token) {
      setTimeout(() => {
        // setPermissions(superAdminAuth?.superAdminInfo?.permissions);
        // localStorage.setItem(
        //   "superAdminInfo",
        //   JSON.stringify(superAdminAuth?.superAdminInfo)
        // );
        navigate("/super_admin");
      }, 1000);
    }
  }, []);

  return (
    <div className="login_container container-fluid">
      <Row className="" style={{ minHeight: "100vh" }}>
        <Col
          sm={12}
          lg={6}
          className="d-flex align-items-center justify-content-center"
        >
          <img src={"../../../assets/logo.png"} alt="logo" className="logo_left" />
        </Col>
        <Col
          sm={12}
          lg={6}
          className="d-flex align-items-center justify-content-around"
        >
          <Form className="form_login" onSubmit={onSubmit}>
            <h3 className="mb-5">
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </h3>
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
            {loading ? (
              <button className="mt-5" type="button">
                <Spinner
                  className="m-auto"
                  animation="border"
                  role="status"
                ></Spinner>
              </button>
            ) : (
              <button className="mt-5" type="submit">
                {" "}
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

export default Login;
