import { TextField } from "@mui/material";
import { Formik, Form, ErrorMessage, Field, useField } from "formik";
import * as Yup from "yup";

const Test = () => {
  // const [field, meta] = useField();
  const initialValues = {
    email: "",
    username: "",
    password: "",
  };
  const onSubmit = (values) => {
    console.log("onSubmit", values);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email adress"),
    password: Yup.string().required("Password is required"),
    username: Yup.string().required("Username is required"),
  });
  return (
    <div>
      <h1>Hello monsterlessons</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <div className="field">
              <Field name="email" placeholder="Email" />

              <div className="error">
                <ErrorMessage name="email" component="span" />
              </div>
            </div>
            <div className="field">
              <TextField
                {...field}
                margin="dense"
                id="username"
                name="username"
                label="الاسم باللغة العربية"
                type="text"
                variant="outlined"
                autoComplete="off"
              />
              <div className="error">
                <ErrorMessage name="username" component="span" />
              </div>
            </div>
            <div className="field">
              <Field name="password" placeholder="Password" type="password" />
              <div className="error">
                <ErrorMessage name="password" component="span" />
              </div>
            </div>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Test;
