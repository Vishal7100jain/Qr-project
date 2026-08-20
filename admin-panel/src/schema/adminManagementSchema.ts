import { AdminStatusEnum } from "@/enums/adminEnums";
import * as yup from "yup";

export const CreateAdminSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required.")
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username must not exceed 30 characters."),

  email: yup
    .string()
    .required("Email is required.")
    .email("Invalid email format.")
    .min(5, "Email must be at least 5 characters long.")
    .max(255, "Email must not exceed 255 characters."),

  contactNumber: yup
    .string()
    .required("Contact number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be 15 digits or less"),

  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(15, "Password must not exceed 15 characters.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
    .matches(/[0-9]/, "Password must contain at least one number.")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character."
    ),

  roleId: yup
    .string()
    .required("Role name is required.")
    .length(24, "Invalid Id length.")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),

  status: yup
    .mixed<AdminStatusEnum>()
    .oneOf(Object.values(AdminStatusEnum as any), {
      message:
        "Please enter a valid Status: Active (1), Inactive (0) or Suspended (2)",
    })
    .required("Status is required"),

  profilePhoto: yup.mixed().notRequired(),

  profilePhotoFile: yup
    .mixed()
    .required("Profile photo is required")
    .test(
      "file-size",
      "Max 1MB allowed",
      (file) => !file || (file instanceof File && file.size <= 1024 * 1024)
    )
    .test(
      "file-type",
      "Only JPEG/PNG allowed",
      (file) =>
        !file ||
        (file instanceof File &&
          ["image/jpeg", "image/png"].includes(file.type))
    ),
});

export const UpdateAdminSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required.")
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username must not exceed 30 characters."),

  email: yup
    .string()
    .required("Email is required.")
    .email("Invalid email format.")
    .min(5, "Email must be at least 5 characters long.")
    .max(255, "Email must not exceed 255 characters."),

  contactNumber: yup
    .string()
    .required("Contact number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be 15 digits or less"),

  password: yup
    .string()
    .optional()
    .test("password-validation", "Password must meet requirements", (value) => {
      if (!value || value.length === 0) return true;
      return (
        value.length >= 8 &&
        value.length <= 15 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value)
      );
    }),

  roleId: yup
    .string()
    .required("Role name is required.")
    .length(24, "Invalid Id length.")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),

  status: yup
    .mixed<AdminStatusEnum>()
    .oneOf(Object.values(AdminStatusEnum as any), {
      message:
        "Please enter a valid Status: Active (1), Inactive (0) or Suspended (2)",
    })
    .required("Status is required"),

  profilePhoto: yup.mixed().notRequired(),

  profilePhotoFile: yup
    .mixed()
    .notRequired()
    .test(
      "file-size",
      "Max 1MB allowed",
      (file) => !file || (file instanceof File && file.size <= 1024 * 1024)
    )
    .test(
      "file-type",
      "Only JPEG/PNG allowed",
      (file) =>
        !file ||
        (file instanceof File &&
          ["image/jpeg", "image/png"].includes(file.type))
    ),
});
