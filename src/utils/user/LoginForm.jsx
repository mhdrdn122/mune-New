import React from 'react'
import CustomInput from './CustomInput';
import { AiFillEye } from 'react-icons/ai';
import { FaLock, FaUser } from 'react-icons/fa';

const LoginForm = ({ formik }) => {
  return (
    <>
      <CustomInput
        id="username"
        name="username"
        label="اسم المستخدم"
        formik={formik}
        iconLeft={<FaUser />}
      />
      <CustomInput
        id="password"
        name="password"
        label="كلمة السر"
        type="password"
        formik={formik}
        iconLeft={<FaLock />}
        iconRight={<AiFillEye />}
      />
    </>
  );
}

export default LoginForm