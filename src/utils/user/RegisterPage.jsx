import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import notify from "../useNotification";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AdminContext } from "../../context/AdminProvider";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserProvider";
import { LanguageContext } from "../../context/LanguageProvider";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import logo from "../../assets/logo.png";
import CustomButton from "./CustomButton";
import ForgetPasswordForm from "./ForgetPasswordForm";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import useLocalStorage from "../../hooks/useLocalStorage";
import { usePermissions } from "../../context/PermissionsContext";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { loginSuperAdminAction } from "../../redux/slice/super_admin/auth/authSlice";
import { loginAdminAction } from "../../redux/slice/auth/authSlice";
import useGetStyle from "../../hooks/useGetStyle";
import { useNotificationFromFirebase } from "../../context/FCMProvider";

const RegisterPage = ({ mode }) => {
  // Context hooks
  const { userToken, setUserToken } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fcmToken } = useNotificationFromFirebase()

  // State management
  const [currentState, setCurrentState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isSelectedAddress, setIsSelectedAddress] = useState(false);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [adminDetails, setAdminDetails] = useState(null);
  const [isPress, setIsPress] = useState(true);

  // Redux state selectors
  const {
    loading: LoadingSuperAdmin,
    superAdminAuth,
    status,
  } = useSelector((state) => state.authSuper);

  const { loading: LoadingAdmin, adminAuth } = useSelector(
    (state) => state.auth
  );

  // Custom hooks
  const { BackgroundColor, BackgroundImg, Logo } = useGetStyle();
  const [, setPermissionsInLocalStorage] = useLocalStorage("permissions", []);
  const { setPermissions } = usePermissions();

  // Formik configuration
  const formik = useFormik({
    initialValues: getInitialValues(adminDetails),
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(currentState),
  });

  // Effect hooks
  useEffect(() => {
    initializeComponent();
  }, []);

  useEffect(() => {
    handleAdminLoginRedirect();
  }, [loading, isPress]);

  useEffect(() => {
    if (adminDetails?.id) {
      formik.setFieldValue("restaurant_id", adminDetails?.id);
      getLocation();
    }
  }, [adminDetails]);

  // Helper functions
  function getInitialValues(adminDetails) {
    return {
      name: "",
      username: "",
      password: "",
      phone: "",
      email: "",
      question: "",
      answer: "",
      code: "",
      new_password: "",
      confirm_password: "",
      restaurant_id: adminDetails?.id,
      longitude: "",
      latitude: "",
      resetMethod: "",
      emailSubmitted: false,
      codeSubmitted: false,
    };
  }

  function getValidationSchema(currentState) {
    const baseSchemas = {
      Login: Yup.object({
        username: Yup.string().required("اسم المستخدم إجباري"),
        password: Yup.string().required("كلمة المرور إجبارية"),
      }),
      "Sign Up": Yup.object({
        name: Yup.string().required("الاسم إجباري"),
        username: Yup.string().required("اسم المستخدم إجباري"),
        password: Yup.string().required("كلمة المرور إجبارية"),
        phone: Yup.string().required("رقم الهاتف إجباري"),
        email: Yup.string()
          .required("الايميل إجباري")
          .email("الايميل غير صالح"),
        question: Yup.string().required("السؤال إجباري"),
        answer: Yup.string().required("الجواب إجباري"),
      }),
      forget_password: Yup.object({
        email: Yup.string()
          .required("الايميل إجباري")
          .email("الايميل غير صالح"),
        code: Yup.string().required("رمز التحقق إجباري"),
        new_password: Yup.string()
          .required("كلمة المرور الجديدة إجبارية")
          .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
        confirm_password: Yup.string()
          .required("تأكيد كلمة المرور إجباري")
          .oneOf([Yup.ref("new_password"), null], "كلمة المرور غير متطابقة"),
      }),
    };

    return baseSchemas[currentState] || Yup.object();
  }

  async function initializeComponent() {
    setLoading(false);
    await getQuestions();
    formik.resetForm();

    // Load admin details from localStorage
    const res = await localStorage.getItem("adminInfo");
    setAdminDetails(JSON.parse(res)?.restaurant || JSON.parse(res));
  }

  async function getQuestions() {
    try {
      const response = await axios.get(
        `${baseURLLocalPublic}/user_api/questions`,
        {
          headers: {
            "Content-Type": "application/json",
            language: language,
          },
        }
      );
      setQuestions(response?.data?.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  function getLocation() {
    setLoading(true);

    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          const newLongitude = position.coords.longitude;
          const newLatitude = position.coords.latitude;

          setLongitude(newLongitude);
          setLatitude(newLatitude);

          formik.setFieldValue("longitude", newLongitude);
          formik.setFieldValue("latitude", newLatitude);

          setIsSelectedAddress(newLongitude !== "");
          setLoading(false);
        }, 1000);
      },
      (error) => {
        console.error("Geolocation Error:", error.code, "-", error.message);
        setTimeout(() => setLoading(false), 1000);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }

  async function handleSubmit(values, { setErrors }) {
    setLoading(true);

    try {
      if (mode === "super_admin") {
        await handleSuperAdminLogin(values);

      } else if (mode === "admin") {
        await handleAdminLogin(values);
      } else {
        await handleUserAuthentication(values, setErrors);
      }
    } catch (error) {
      console.log(error?.message)
      notify(error?.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSuperAdminLogin(values) {
    setIsPress(true);
    const res = await dispatch(
      loginSuperAdminAction({
        user_name: values?.username,
        password: values?.password,
      })
    );
    setIsPress(false);

    if (!res?.payload?.status) {
      notify(res?.payload?.message, "error")
    }
    if (superAdminAuth?.superAdminInfo?.token) {
      handleSuccessfulLogin(superAdminAuth?.superAdminInfo, "super_admin");
    }
  }

  async function handleAdminLogin(values) {

    setIsPress(true);
    const res = await dispatch(
      loginAdminAction({
        user_name: values?.username,
        password: values?.password,
        fcm_token: fcmToken
      })
    );
    setIsPress(false);

    if (!res?.payload?.status) {
      notify(res?.payload?.message, "error")
    }
    if (adminAuth.adminInfo?.token) {
      handleSuccessfulLogin(adminAuth?.adminInfo, "admin");
    }
  }

  async function handleUserAuthentication(values, setErrors) {
    const endpoint = getEndpoint(currentState);
    values["fcm_token"] = fcmToken
    console.log(values)
    const result = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, restaurant_id: adminDetails?.id }),
    }).then(res => res.json());

    if (result.status) {
      notify(result?.message, "success");
      setUserToken(result?.data?.token);
      navigate(`/${adminDetails?.name_url}/takeout`);
    } else {
      setErrors(result?.errors);
      notify(result.message, "error");
    }
  }

  function getEndpoint(currentState) {
    const endpoints = {
      "Login": `${baseURLLocalPublic}/user_api/login`,
      "Sign Up": `${baseURLLocalPublic}/user_api/register`,
      "forget_password": mode === "admin"
        ? `${baseURLLocalPublic}/admin_api/forget_password`
        : `${baseURLLocalPublic}/user_api/forget_password`
    };

    return endpoints[currentState];
  }

  function handleSuccessfulLogin(userInfo, userType) {
    if (!userInfo || Object.keys(userInfo).length === 0) {
      notify(userType === "super_admin"
        ? superAdminAuth?.error?.message
        : adminAuth?.error?.message,
        "error");
      return;
    }

    // Save user info to localStorage
    const storageKey = userType === "super_admin" ? "superAdminInfo" : "adminInfo";
    localStorage.setItem(storageKey, JSON.stringify(userInfo));

    // Handle permissions
    if (userInfo?.permissions) {
      setPermissions(userInfo.permissions);
      setPermissionsInLocalStorage(userInfo.permissions);
    }

    notify("تم تسجيل الدخول بنجاح", "success");

    // Navigate based on user type and permissions
    const navigatePath = getNavigationPath(userType, userInfo);
    setTimeout(() => navigate(navigatePath), userType === "admin" ? 1500 : 1000);
  }

  function getNavigationPath(userType, userInfo) {
    if (userType === "super_admin") return "/super_admin";
    if (userType === "admin") {
      localStorage.setItem("selected", "الأصناف");
      return userInfo?.permissions?.some(item => item.name === "my_restaurants")
        ? "/admin/rests"
        : "/admin";
    }
    return "/";
  }

  function handleAdminLoginRedirect() {
    if (isPress || loading) return;

    if (mode === "super_admin") {
      handleSuperAdminRedirect();
    } else if (mode === "admin") {
      handleAdminRedirect();
    }
  }

  function handleSuperAdminRedirect() {
    if (superAdminAuth?.superAdminInfo?.token) {
      handleSuccessfulLogin(superAdminAuth?.superAdminInfo, "super_admin");
    }
  }

  function handleAdminRedirect() {
    if (adminAuth?.adminInfo?.token) {
      handleSuccessfulLogin(adminAuth?.adminInfo, "admin");
    }
  }

  // UI rendering functions
  function renderHeader() {
    if (currentState !== "Login") return null;

    return (
      <header className={`${currentState === "Login" ? "md:hidden" : "flex"} justify-center mt-5`}>
        <p className="text-3xl text-[#2F4B26] font-bold">
          {currentState === "Login" ? "تسجيل الدخول" :
            currentState === "Sign Up" ? "إنشاء حساب" :
              "RESET PASSWORD"}
        </p>
      </header>
    );
  }

  function renderLogo() {
    if (currentState !== "Login") return null;

    return (
      <img
        src={mode !== "user" ? logo : Logo}
        alt="logo"
        className="!w-[100px] !h-[100px] rounded-full md:hidden"
      />
    );
  }

  function renderFormContent() {
    switch (currentState) {
      case "Login":
        return <LoginForm formik={formik} />;
      case "Sign Up":
        return <SignUpForm formik={formik} questions={questions} />;
      case "forget_password":
        return (
          <ForgetPasswordForm
            formik={formik}
            questions={questions}
            loading={loading}
            setLoading={setLoading}
            userToken={userToken}
            setUserToken={setUserToken}
            setCurrentState={setCurrentState}
            adminDetails={adminDetails}
            mode={mode}
          />
        );
      default:
        return null;
    }
  }

  function renderRememberMeAndForgotPassword() {
    if (currentState !== "Login" || mode === "super_admin") return null;

    return (
      <div className="flex justify-between w-full px-2 items-center">
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            id="rememberMe"
            className="h-4 w-4 text-[#2F4B26] border-[#818360] rounded focus:ring-[#2F4B26]"
          />
          <label htmlFor="rememberMe" className="text-sm text-[#2F4B26]">
            تذكرني
          </label>
        </div>

        <button
          onClick={() => {
            setCurrentState("forget_password");
            formik.resetForm();
          }}
          className="text-sm text-red-500 hover:underline hover:text-red-600 transition-colors"
        >
          نسيت كلمة المرور؟
        </button>
      </div>
    );
  }

  function renderSubmitButton() {
    if (currentState !== "Login" && currentState !== "Sign Up") return null;

    return (
      <div className="flex justify-end">
        <CustomButton
          type="submit"
          loading={loading}
          adminDetails={adminDetails}
          className="px-6 py-2.5 text-sm bg-[#2F4B26] text-[#2F4B26]  hover:bg-[#2F4B26]/90 rounded-full"
        >
          {currentState === "Sign Up" ? "إنشاء حساب" : "تسجيل دخول"}
        </CustomButton>
      </div>
    );
  }

  function renderDivider() {
    if (currentState !== "Login" && currentState !== "Sign Up") return null;

    return (
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#818360]/30"></div>
        </div>
        <div className="relative bg-[#f5f5f5] px-3 text-sm text-[#818360]">
          أو
        </div>
      </div>
    );
  }

  function renderSocialButtons() {
    if (currentState !== "Login" && currentState !== "Sign Up") return null;

    return (
      <div className="flex justify-center gap-4">
        {['facebook', 'google', 'apple'].map((social) => (
          <SocialButton key={social} type={social} />
        ))}
      </div>
    );
  }

  function SocialButton({ type }) {
    const socialConfig = {
      facebook: {
        bgColor: "#3b5998",
        icon: (
          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
        ),
      },
      google: {
        bgColor: "#db4437",
        icon: (
          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-.67-.069-1.325-.173-1.971h-9.827z" />
        ),
      },
      apple: {
        bgColor: "#BDD358",
        icon: (
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        ),
      },
    };

    const { bgColor, icon } = socialConfig[type];
    console.log(bgColor)
    return (
      <button
        className={`p-3 rounded-full !bg-[${bgColor}] text-white hover:bg-[${bgColor}]/90 transition-colors`}
        aria-label={`تسجيل الدخول عبر ${type}`}
        style={{
          borderRadius: "50%",
          background: bgColor
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </button>
    );
  }

  function renderAuthToggle() {
    if (mode === "super_admin" || mode === "admin") return null;

    return (
      <div className="text-center pt-2">
        <p className="text-sm text-[#2F4B26]">
          {currentState === "Login" || currentState === "forget_password"
            ? "ليس لديك حساب؟"
            : "لديك حساب بالفعل؟"}{" "}
          <button
            onClick={(e) => {
              e.preventDefault();
              setCurrentState(currentState === "Login" ? "Sign Up" : "Login");
            }}
            className="text-red-500 hover:underline font-medium"
          >
            {currentState === "Login" || currentState === "forget_password"
              ? "سجل الآن"
              : "سجل دخول"}
          </button>
        </p>
      </div>
    );
  }

  function renderSidePanel() {
    if (currentState !== "Login") return null;

    return (
      <div className="hidden md:flex justify-center items-center flex-col bg-green-500 !w-[800px] rounded-3xl">
        <header className="flex justify-center mt-5">
          <p className="text-white text-2xl font-bold">
            {currentState === "Login"
              ? "تسجيل الدخول"
              : currentState === "Sign Up"
                ? "إنشاء حساب"
                : "إعادة كتابة كلمة المرور"}
          </p>
        </header>
        <img
          src={mode !== "user" ? logo : Logo}
          alt="logo"
          className="!w-[200px] !h-[200px] rounded-full"
        />
      </div>
    );
  }

  // Get background style based on mode
  const backgroundStyle = {
    backgroundColor: mode === "user" ? "#" + BackgroundColor : undefined,
    backgroundImage: mode === "user" ? BackgroundImg : "url('https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={backgroundStyle}
    >
      <div className="bg-white/20 m-4 relative flex gap-4 backdrop-blur-lg border border-white/30 rounded-3xl w-[80%] md:w-[70%] lg:w-[60%] text-center shadow-lg">
        <form
          className="w-100 p-6 flex flex-col justify-between min-h-[500px] sm:p-8"
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-1 flex-col justify-between items-center mb-6">
            {renderHeader()}
            {renderLogo()}
          </div>

          <div className="flex flex-3 justify-end gap-4 items-center flex-col">
            {renderFormContent()}
            {renderRememberMeAndForgotPassword()}
          </div>

          <footer className="mt-2 flex-1 justify-end space-y-4">
            {(currentState === "Login" || currentState === "Sign Up" || currentState === "forget_password") && (
              <>
                <div className="flex flex-col space-y-3">
                  {renderSubmitButton()}
                </div>
                {renderDivider()}
                {renderSocialButtons()}
                {renderAuthToggle()}
              </>
            )}
          </footer>
        </form>

        {renderSidePanel()}
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;