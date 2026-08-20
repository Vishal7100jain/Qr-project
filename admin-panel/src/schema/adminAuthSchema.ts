import * as yup from "yup";

export const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email")
    .min(5, "Email must be at least 5 characters")
    .max(50, "Email can't exceed 50 characters."),
  password: yup
    .string()
    .required("Password is required")
    .min(2, "Password must be at least 2 characters")
    .max(15, "Password can't exceed 15 characters."),
});
