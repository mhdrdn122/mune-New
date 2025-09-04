import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  useTheme,

} from "@mui/material";
import { Spinner, Modal, Button } from "react-bootstrap";
import notify from '../useNotification';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AdminContext } from '../../context/AdminProvider';
import { baseURLLocalPublic } from '../../Api/baseURLLocal';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import undraw from "../../assets/login-undraw.svg"
import { UserContext } from '../../context/UserProvider';
import { LanguageContext } from '../../context/LanguageProvider';
import axios from 'axios';
import { useNotificationFromFirebase } from '../../context/FCMProvider';
const LoginUserModal = ({ show, handleClose }) => {

  const { adminDetails } = useContext(AdminContext);
  const [currentState, setCurrentState] = useState("Login")
  const { userToken, setUserToken } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  // const { fcmToken } = useNotificationFromFirebase()

  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    getQuestions()
  }, []);
  useEffect(() => {
    console.log('the questions are  : ', questions)
  }, [questions]);

  const getQuestions = async () => {
    try {
      const response = await axios.get(`${baseURLLocalPublic}/user_api/questions`, {
        headers: {
          'Content-Type': 'application/json',
          'language': language
        }
      })
      console.log('response of questions : ', response)
      setQuestions(response?.data?.data)
    } catch (error) {
      console.log('error from questions : '.error)
    }
  }
  useEffect(() => {
    if (adminDetails?.id) {
      formik.setFieldValue("restaurant_id", adminDetails.id);
    }
  }, [adminDetails]);
  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
      phone: "",
      address: "",
      email: "",
      question: "",
      answer: "",
      code: "", // For forget_password state
      new_password: "", // For forget_password state
      confirm_password: "", // For forget_password state
      restaurant_id: adminDetails?.id || "",
    },
    onSubmit: async (values, { setErrors }) => {
      console.log('login values : ', values)
      setLoading(true)
      const endpoint =
        currentState === "Login"
          ? `${baseURLLocalPublic}/user_api/login`
          : currentState === "Sign Up"
            ? `${baseURLLocalPublic}/user_api/register`
            : `${baseURLLocalPublic}/user_api/forget_password`;
      try {
        let result = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( values),
        })
        result = await result.json();
        if (result.status == true) {
          handleClose()
          console.log('result : ', result);
          setTimeout(() => {
            notify(result?.message, "success")
          }, 200)
          setUserToken(result?.data?.token)
        } else {
          setErrors(result?.errors);
          console.log('result : ', result)
          notify(result.message, 'error')
        }
      } catch (error) {
        console.error('Error during login:', error);
        setTimeout(() => {
          notify("An error occurred. Please try again.", "error");
        }, 500);
      } finally {
        setLoading(false)
      }
    },

    validationSchema: Yup.object({
      // Login validation
      ...(currentState === "Login" && {
        username: Yup.string().required("اسم المستخدم إجباري"),
        password: Yup.string().required("كلمة المرور إجبارية"),
      }),
      // Sign Up validation
      ...(currentState === "Sign Up" && {
        name: Yup.string().required("الاسم إجباري"),
        username: Yup.string().required("اسم المستخدم إجباري"),
        password: Yup.string().required("كلمة المرور إجبارية"),
        phone: Yup.string().required("رقم الهاتف إجباري"),
        address: Yup.string().required("العنوان إجباري"),
        email: Yup.string().required("الايميل إجباري").email("الايميل غير صالح"),
        question: Yup.string().required("السؤال إجباري"),
        answer: Yup.string().required("الجواب إجباري"),
      }),
      // forget_password validation
      ...(currentState === "forget_password" && {
        email: Yup.string().required("الايميل إجباري").email("الايميل غير صالح"),
        code: Yup.string().required("رمز التحقق إجباري"),
        new_password: Yup.string()
          .required("كلمة المرور الجديدة إجبارية")
          .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
        confirm_password: Yup.string()
          .required("تأكيد كلمة المرور إجباري")
          .oneOf([Yup.ref("new_password"), null], "كلمة المرور غير متطابقة"),
      }),
    }),
  });

  const handleLoginOrRegister = (e) => {
    e.preventDefault();
    console.log('currState : ', currentState)
  }
  return (
    <Modal show={show} onHide={handleClose} centered>
      <form
      // onSubmit={(event) => {
      //   event.preventDefault();
      //   formik.handleSubmit;
      // }} 
      >
        <Modal.Header className="d-flex justify-content-center">
          <Modal.Title>{currentState == "Login" ? "تسجيل الدخول" : currentState == "Sign Up" ? "إنشاء حساب" :
            "إعادة كتابة كلمة المرور"}</Modal.Title>
        </Modal.Header>
        <img
          className="mx-auto d-block"
          height="200px"
          width="60%"
          src={undraw}
        />

        <Modal.Body>
          {(currentState == "Sign Up" || currentState == "Login") &&
            <Box
              m="40px 0 0 0"
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, 1fr)"
            >
              {currentState == "Sign Up" &&
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
                  error={!!formik?.touched?.name && !!formik?.errors?.name}
                  helperText={formik?.touched?.name && formik?.errors?.name}
                />
              }
              <TextField
                margin="dense"
                id="username"
                name="username"
                label="اسم المستخدم"
                type="text"
                fullWidth
                sx={{ gridColumn: "span 2" }}
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                error={!!formik?.touched?.username && !!formik?.errors?.username}
                helperText={formik?.touched?.username && formik?.errors?.username}
              />
              <TextField
                margin="dense"
                id="password"
                name="password"
                label="كلمة السر"
                type="password"
                fullWidth
                sx={{ gridColumn: "span 2" }}
                variant="outlined"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={!!formik?.touched?.password && !!formik?.errors?.password}
                helperText={formik?.touched?.password && formik?.errors?.password}
              />
              {currentState == "Sign Up" &&
                <>
                  <TextField
                    margin="dense"
                    id="phone"
                    name="phone"
                    label="رقم الهاتف"
                    type="phone"
                    fullWidth
                    sx={{ gridColumn: "span 2" }}
                    variant="outlined"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    error={!!formik?.touched?.phone && !!formik?.errors?.phone}
                    helperText={formik?.touched?.phone && formik?.errors?.phone}
                  />
                  <TextField
                    margin="dense"
                    id="address"
                    name="address"
                    label="العنوان"
                    type="address"
                    fullWidth
                    sx={{ gridColumn: "span 2" }}
                    variant="outlined"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    error={!!formik?.touched?.address && !!formik?.errors?.address}
                    helperText={formik?.touched?.address && formik?.errors?.address}
                  />
                  <TextField
                    margin="dense"
                    id="email"
                    name="email"
                    label="الايميل"
                    type="email"
                    fullWidth
                    sx={{ gridColumn: "span 2" }}
                    variant="outlined"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={!!formik?.touched?.email && !!formik?.errors?.email}
                    helperText={formik?.touched?.email && formik?.errors?.email}
                  />
                  <FormControl
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    sx={{ gridColumn: "span 2" }}
                    error={!!formik?.touched?.role && !!formik?.errors?.role}
                  >
                    <InputLabel id="question">السؤال</InputLabel>
                    <Select
                      inputLabelProps={{ shrink: true }}
                      labelId="question"
                      id="question"
                      name="question"
                      label="question"
                      // size="small"
                      value={formik.values.question}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    // error={!!formik.touched.role && !!formik?.errors?.role}
                    >
                      {questions &&
                        questions.map((question) => (
                          <MenuItem
                            key={question.id}
                            value={question.id}
                          // style={getStyles(question.question, formik.values.question, theme)}
                          >
                            {question.question}
                          </MenuItem>
                        ))}
                    </Select>
                    {formik.touched.question && formik?.errors?.question && (
                      <FormHelperText>{formik?.errors?.question}</FormHelperText>
                    )}
                  </FormControl>
                  {(
                    formik.values.question
                  ) && (
                      <TextField
                        margin="dense"
                        id="answer"
                        name="answer"
                        label="الجواب"
                        type="answer"
                        fullWidth
                        sx={{ gridColumn: "span 2" }}
                        variant="outlined"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.answer}
                        error={!!formik.touched.answer && !!formik?.errors?.answer}
                        helperText={formik.touched.answer && formik?.errors?.answer}
                      />
                    )}
                </>
              }
            </Box>
          }
          {currentState === "forget_password" && (
            <Box
              m="40px 0 0 0"
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, 1fr)"
            >
              {!formik.values.resetMethod && (
                <>
                  <Button
                    variant="contained"
                    onClick={() => formik.setFieldValue("resetMethod", "email")}
                    style={{
                      gridColumn: "span 2", color: 'white',
                      backgroundColor: `#${adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                        }`
                    }}
                  >
                    Reset via Email
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => formik.setFieldValue("resetMethod", "question")}
                    style={{
                      gridColumn: "span 2", color: 'white',
                      backgroundColor: `#${adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                        }`
                    }}
                  >
                    Reset via Security Question
                  </Button>
                </>
              )}

              {formik.values.resetMethod === "email" && (
                <>
                  {!formik.values.emailSubmitted && (
                    <TextField
                      id="email"
                      name="email"
                      label="Enter your email"
                      type="email"
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                  )}
                  {formik.values.emailSubmitted && !formik.values.codeSubmitted && (
                    <TextField
                      id="code"
                      name="code"
                      label="Enter the received code"
                      type="text"
                      fullWidth
                      sx={{ gridColumn: "span 4" }}
                      onChange={formik.handleChange}
                      value={formik.values.code}
                    />
                  )}
                  {formik.values.codeSubmitted && (
                    <>
                      <TextField
                        id="new_password"
                        name="new_password"
                        label="New Password"
                        type="password"
                        fullWidth
                        sx={{ gridColumn: "span 2" }}
                        onChange={formik.handleChange}
                        value={formik.values.new_password}
                      />
                      <TextField
                        id="confirm_password"
                        name="confirm_password"
                        label="confirm Password"
                        type="password"
                        fullWidth
                        sx={{ gridColumn: "span 2" }}
                        onChange={formik.handleChange}
                        value={formik.values.confirm_password}
                      />
                    </>
                  )}

                  <Button
                    variant="contained"
                    onClick={async () => {
                      if (!formik.values.emailSubmitted) {
                        // Call API to send reset code
                        try {
                          setLoading(true)

                          const response = await axios.post(
                            `${baseURLLocalPublic}/user_api/forget_password`,
                            {
                              email: formik.values.email,
                              method: 1,
                              restaurant_id: adminDetails?.id
                            }
                          )
                          formik.setFieldValue("emailSubmitted", true);
                          console.log('response of forget_password : ', response)
                          notify(response.data?.message, "success")
                        } catch (error) {
                          notify(error?.response?.data?.message, "error")
                          // console.log('error of entering email : ',error)
                        } finally {
                          setLoading(false)
                        }
                      } else if (!formik.values.codeSubmitted) {
                        // Call API to verify the code
                        try {
                          setLoading(true)

                          const response = await axios.post(
                            `${baseURLLocalPublic}/user_api/check_code`,
                            { code: formik.values.code }
                          );
                          formik.setFieldValue("codeSubmitted", true);
                          console.log('response of check_code : ', response)
                          notify(response?.data?.message, "success");
                          setUserToken(response?.data?.data?.token)
                        } catch (error) {
                          notify(error?.response?.data?.message, "error");
                          console.log('error of entering code : ', error)
                        } finally {
                          setLoading(false)
                        }

                      } else {
                        // Call API to forget_password
                        try {
                          setLoading(true)
                          const response = await axios.post(
                            `${baseURLLocalPublic}/user_api/reset_password`,
                            {
                              password: formik.values.new_password,
                              repeat_password: formik.values.confirm_password,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${userToken}`, // Pass the token here
                                "Content-Type": "application/json",
                              }
                            }
                          );
                          if (response.status) {
                            notify(response?.data?.message, "success");
                            console.log('response of reset_password : ', response)

                            handleClose();
                          }
                          console.log('response of reset_password : ', response)
                        } catch (error) {
                          console.log('error of reset_password : ', error)
                          notify(error?.response?.data?.message, "error")
                        } finally {
                          setLoading(false)

                        }
                      }
                    }}
                    style={{
                      gridColumn: "span 4", color: 'white',
                      backgroundColor: `#${adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                        }`
                    }}
                  >
                    {loading ?
                      <Spinner color='white' animation="border" role="status" size='sm'
                      /> :
                      (formik.values.codeSubmitted
                        ? "reset password"
                        : formik.values.emailSubmitted
                          ? "Verify Code"
                          : "Send Code")
                    }
                  </Button>
                </>
              )}

              {formik.values.resetMethod === "question" && (
                <>
                  <TextField
                    id="username"
                    name="username"
                    label="username"
                    type="text"
                    fullWidth
                    sx={{ gridColumn: "span 4" }}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                  <FormControl
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    sx={{ gridColumn: "span 4" }}
                  >
                    <InputLabel id="question">Security Question</InputLabel>
                    <Select
                      // InputLabelProps={{ shrink: true }}
                      // labelId="question"
                      id="question"
                      name="question"
                      label="security question"
                      value={formik.values.question}
                      onChange={formik.handleChange}
                    >
                      {questions.map((q) => (
                        <MenuItem key={q.id} value={q.id}>
                          {q.question}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    id="answer"
                    name="answer"
                    label="Answer"
                    type="text"
                    fullWidth
                    sx={{ gridColumn: "span 4" }}
                    onChange={formik.handleChange}
                    value={formik.values.answer}
                  />
                  <Button
                    variant="contained"
                    onClick={async () => {
                      // Verify security question answer
                      try {
                        setLoading(true)
                        const response = await axios.post(
                          `${baseURLLocalPublic}/user_api/forget_password`,
                          {
                            restaurant_id: adminDetails?.id,
                            method: 0,
                            username: formik.values.username,
                            question: formik.values.question,
                            answer: formik.values.answer,
                          }
                        );

                        formik.setFieldValue("codeSubmitted", true);
                        console.log('response of verify Answer : ', response)
                        notify(response?.data?.message, "success");
                        setUserToken(response?.data?.data?.token)
                        handleClose()
                      } catch (error) {
                        notify(error?.response?.data?.message, "error")
                        console.log('error of verify code : ', error)
                      } finally {
                        setLoading(false)
                      }
                    }}
                    style={{
                      gridColumn: "span 4", color: 'white',
                      backgroundColor: `#${adminDetails &&
                        adminDetails.color &&
                        adminDetails.color.substring(10, 16)
                        }`
                    }}
                  >
                    {loading ?
                      <Spinner
                        className="m-auto"
                        animation="border"
                        role="status"
                        size='sm'
                      ></Spinner>
                      : 'Verify Answer'}
                  </Button>
                </>
              )}
            </Box>
          )}

        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-between'>
          <div>
            {currentState === "Login" ? (
              <div className='d-flex flex-column align-items-center gap-1'>
                <div>
                  <p>
                    <span
                      style={{
                        color: `#${adminDetails &&
                          adminDetails.color &&
                          adminDetails.color.substring(10, 16)
                          }`,
                        cursor: 'pointer'
                      }}
                      dir='rtl' onClick={() => {
                        setCurrentState("Sign Up")
                        formik.resetForm()
                      }}> اضغط هنا
                    </span>
                    إنشاء حساب جديد ؟
                  </p>

                </div>
                <div>
                  <p>
                    <span
                      style={{
                        color: `#${adminDetails &&
                          adminDetails.color &&
                          adminDetails.color.substring(10, 16)
                          }`,
                        cursor: 'pointer'
                      }}
                      dir='rtl' onClick={() => {
                        setCurrentState("forget_password")
                        formik.resetForm()

                      }}>إعادة كلمة المرور
                    </span> هل نسيت كلمة المرور ؟
                  </p>
                </div>
              </div>
            ) : (<> <p> <span
              style={{
                color: `#${adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                  }`,
                cursor: 'pointer'
              }}
              dir='rtl' onClick={() => {
                setCurrentState("Login")
                formik.resetForm()

              }}>سجل دخول</span> لديك حساب مسبق ؟ </p>

            </>
            )}
          </div>

          {(currentState == "Login" || currentState == "Sign Up") && <div>
            <Button
              style={{
                backgroundColor: `#${adminDetails &&
                  adminDetails.color &&
                  adminDetails.color.substring(10, 16)
                  }`,
                cursor: 'pointer',
                color: 'white',
              }}
              variant="contained"
              className="mx-2"
              onClick={() => {
                handleClose();
                formik.resetForm();
              }}
            >
              تجاهل
            </Button>

            {loading === true ? (
              <Button variant="contained" className="">
                <Spinner
                  className="m-auto"
                  animation="border"
                  role="status"
                ></Spinner>
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: `#${adminDetails &&
                    adminDetails.color &&
                    adminDetails.color.substring(10, 16)
                    }`,
                  color: 'white',
                  cursor: 'pointer'
                }}
                variant="contained"
                type="submit"
                className=""
                onClick={formik.handleSubmit}
              >
                {currentState == "Sign Up" ? "إنشاء حساب" : "تسجيل دخول"}
              </Button>
            )}
          </div>}
        </Modal.Footer>
      </form>
      {/* <ToastContainer /> */}
    </Modal>

  )
}

export default LoginUserModal