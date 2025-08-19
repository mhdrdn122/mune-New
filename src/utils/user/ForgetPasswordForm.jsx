import React, { useState } from "react";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";
import { FaLock, FaUser } from "react-icons/fa";
import CustomSelect from "./CustomSelect";
import notify from "../useNotification";
import axios from "axios";
import { baseURLLocalPublic } from "../../Api/baseURLLocal";
import { AiFillEye } from "react-icons/ai";
import { CgMail } from "react-icons/cg";
import gmail from "../../assets/gmail.png";

const ForgetPasswordForm = ({
  formik,
  questions,
  loading,
  setLoading,
  adminDetails,
  userToken,
  setUserToken,
  setCurrentState,
  mode = "user",
}) => {
  return (
    <>
      {!formik.values.resetMethod && (
        <>
          <p
            style={{
              margin: "20px 0 !important",
            }}
            classname="!text-lg   md:text-2xl  "
          >
            {mode == "admin"
              ? "You can Reset Your PassWord By Your Email  "
              : "You can Reset Your PassWord By choosing the way you like "}
          </p>

          <CustomButton
            onClick={() => formik.setFieldValue("resetMethod", "email")}
            className="  rounded-lg"
            style={{ borderRadius: "50px", maxWidth: "300px" }}
          >
            Reset via Email
          </CustomButton>
          {mode == "user" ? (
            <CustomButton
              onClick={() => formik.setFieldValue("resetMethod", "question")}
              className=" "
              style={{ borderRadius: "50px", maxWidth: "300px" }}
            >
              Reset via Security Question
            </CustomButton>
          ) : null}
        </>
      )}

      {formik.values.resetMethod === "email" && (
        <>
          {!formik.values.emailSubmitted && (
            <div className="flex items-center flex-col justify-center gap-10 w-full">
              <img src={gmail} className="w-45" alt="gmail img" />

              <CustomInput
                id="email"
                name="email"
                label="Enter your email"
                type="email"
                formik={formik}
                iconLeft={
                  <CgMail
                    style={{
                      fontSize: "22px",
                    }}
                  />
                }
                fullWidth={false}
                className="col-span-4 "
              />
            </div>
          )}
          {formik.values.emailSubmitted && !formik.values.codeSubmitted && (
            <div className="flex items-center flex-col justify-center gap-10 w-full">
              <div>
                <img src={gmail} className="w-45" alt="gmail img" />
                <p>Enter the code that you recived </p>
              </div>

              <div className="flex justify-center gap-2 space-x-2 col-span-4">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4B26]"
                    value={formik.values.code?.[i] || ""}
                    onChange={(e) => {
                      const newCode = [...(formik.values.code || "")];
                      newCode[i] = e.target.value;
                      formik.setFieldValue("code", newCode.join(""));

                      // to next field
                      if (e.target.value && i < 3) {
                        document.getElementById(`code-input-${i + 1}`).focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // to back field when onKeyDown backspace
                      if (e.key === "Backspace" && !e.target.value && i > 0) {
                        document.getElementById(`code-input-${i - 1}`).focus();
                      }
                    }}
                    id={`code-input-${i}`}
                  />
                ))}
              </div>
            </div>
          )}
          {formik.values.codeSubmitted && (
            <>
              <CustomInput
                id="new_password"
                name="new_password"
                label="New Password"
                type="password"
                formik={formik}
                iconLeft={<FaLock />}
                iconRight={<AiFillEye />}
              />
              <CustomInput
                id="confirm_password"
                name="confirm_password"
                label="Confirm Password"
                type="password"
                formik={formik}
                iconLeft={<FaLock />}
                iconRight={<AiFillEye />}
              />
            </>
          )}

          <CustomButton
            style={{ borderRadius: "50px", maxWidth: "300px" }}
            onClick={async () => {
              if (!formik.values.emailSubmitted) {
                try {
                  setLoading(true);
                  console.log("test");

                  const response = await axios.post(
                    mode == "admin"
                      ? `${baseURLLocalPublic}/admin_api/forget_password`
                      : `${baseURLLocalPublic}/user_api/forget_password`,

                      mode != "user" ? 
                    {
                      email: formik.values.email,
                      method: 1,
                     } : {
                      email: formik.values.email,
                      method: 1,
                      restaurant_id: adminDetails?.id || 2,
                    }
                  );

                  formik.setFieldValue("emailSubmitted", true);
                  console.log("response of forget_password : ", response);
                  notify(response.data?.message, "success");
                } catch (error) {
                  notify(error?.response?.data?.message, "error");
                } finally {
                  setLoading(false);
                }
              } else if (!formik.values.codeSubmitted) {
                console.log("test");

                try {
                  setLoading(true);
                  const response = await axios.post(
                    mode == "admin"
                      ? `${baseURLLocalPublic}/admin_api/check_code`
                      : `${baseURLLocalPublic}/user_api/check_code`,
                    { code: formik.values.code }
                  );
                  formik.setFieldValue("codeSubmitted", true);
                  console.log("response of check_code : ", response);
                  notify(response?.data?.message, "success");
                  setUserToken(response?.data?.data?.token);
                } catch (error) {
                  notify(error?.response?.data?.message, "error");
                  console.log("error of entering code : ", error);
                } finally {
                  setLoading(false);
                }
              } else {
                try {
                  setLoading(true);
                  const response = await axios.post(
                    mode == "admin"
                      ? `${baseURLLocalPublic}/admin_api/reset_password`
                      : `${baseURLLocalPublic}/user_api/reset_password`,
                    {
                      password: formik.values.new_password,
                      repeat_password: formik.values.confirm_password,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  setCurrentState("Login");
                  if (response.status) {
                    notify(response?.data?.message, "success");
                    console.log("response of reset_password : ", response);
                  }
                  console.log("response of reset_password : ", response);
                } catch (error) {
                  console.log("error of reset_password : ", error);
                  notify(error?.response?.data?.message, "error");
                } finally {
                  setLoading(false);
                }
              }
            }}
            loading={loading}
            className="col-span-4"
          >
            {formik.values.codeSubmitted
              ? "reset password"
              : formik.values.emailSubmitted
              ? "Verify Code"
              : "Send Code"}
          </CustomButton>
        </>
      )}

      {formik.values.resetMethod === "question" && (
        <>
          {!formik.values.codeSubmitted && (
            <>
              <CustomInput
                id="username"
                name="username"
                label="username"
                formik={formik}
                iconLeft={<FaUser />}
                fullWidth={false}
                className="col-span-4"
              />
              <CustomSelect
                id="question"
                name="question"
                label="Security Question"
                formik={formik}
                options={questions}
                fullWidth={false}
                className="col-span-4"
              />
              <CustomInput
                id="answer"
                name="answer"
                label="Answer"
                formik={formik}
                iconLeft={<FaUser />}
                fullWidth={false}
                className="col-span-4"
              />
              <CustomButton
                onClick={async () => {
                  try {
                    console.log(adminDetails);
                    setLoading(true);
                    const response = await axios.post(
                      `${baseURLLocalPublic}/user_api/forget_password`,
                      {
                        restaurant_id: adminDetails?.id || 2,
                        method: 0,
                        username: formik.values.username,
                        question: formik.values.question,
                        answer: formik.values.answer,
                      }
                    );
                    formik.setFieldValue("codeSubmitted", true);
                    console.log("response of verify Answer : ", response);
                    notify(response?.data?.message, "success");
                    setUserToken(response?.data?.data?.token);
                  } catch (error) {
                    notify(error?.response?.data?.message, "error");
                    console.log("error of verify code : ", error);
                  } finally {
                    setLoading(false);
                  }
                }}
                loading={loading}
                className="col-span-4"
              >
                Verify Answer
              </CustomButton>
            </>
          )}
          {formik.values.codeSubmitted && (
            <>
              <CustomInput
                id="new_password"
                name="new_password"
                label="New Password"
                type="password"
                formik={formik}
                iconLeft={<FaLock />}
                iconRight={<AiFillEye />}
              />
              <CustomInput
                id="confirm_password"
                name="confirm_password"
                label="Confirm Password"
                type="password"
                formik={formik}
                iconLeft={<FaLock />}
                iconRight={<AiFillEye />}
              />
            </>
          )}

          {formik.values.codeSubmitted && (
            <CustomButton
              style={{ borderRadius: "50px", maxWidth: "300px" }}
              onClick={async () => {
                try {
                  setLoading(true);
                  const response = await axios.post(
                    `${baseURLLocalPublic}/user_api/reset_password`,
                    {
                      password: formik.values.new_password,
                      repeat_password: formik.values.confirm_password,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  setCurrentState("Login");
                  if (response.status) {
                    notify(response?.data?.message, "success");
                    console.log("response of reset_password : ", response);
                  }
                  console.log("response of reset_password : ", response);
                } catch (error) {
                  console.log("error of reset_password : ", error);
                  notify(error?.response?.data?.message, "error");
                } finally {
                  setLoading(false);
                }
              }}
              loading={loading}
              className="col-span-4"
            >
              {formik.values.codeSubmitted
                ? "reset password"
                : formik.values.emailSubmitted
                ? "Verify Code"
                : "Send Code"}
            </CustomButton>
          )}
        </>
      )}
    </>
  );
};

export default ForgetPasswordForm;
