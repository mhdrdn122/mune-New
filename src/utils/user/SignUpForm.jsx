import React from 'react'
import CustomInput from './CustomInput';
import { FaLock, FaUser } from 'react-icons/fa';
import { AiFillEye } from 'react-icons/ai';
import CustomSelect from './CustomSelect';

const SignUpForm = ({ formik, questions }) => {
  return (
    <>
      <CustomInput
        id="name"
        name="name"
        label="الاسم"
        formik={formik}
        iconLeft={<FaUser />}
      />
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
      <CustomInput
        id="phone"
        name="phone"
        label="رقم الهاتف"
        type="tel"
        formik={formik}
        iconLeft={<FaUser />}
      />
      <CustomInput
        id="email"
        name="email"
        label="الايميل"
        type="email"
        formik={formik}
        iconLeft={<FaUser />}
      />
      <CustomSelect
        id="question"
        name="question"
        label="السؤال"
        formik={formik}
        options={questions}
      />
      {formik.values.question && (
        <CustomInput
          id="answer"
          name="answer"
          label="الجواب"
          formik={formik}
          iconLeft={<FaUser />}
        />
      )}
    </>
  );
};

export default SignUpForm