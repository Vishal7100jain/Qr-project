import { GenderType } from "@/enums/adminEnums";
import * as yup from "yup";

export const CreateMemberSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must not exceed 255 characters"),

  bio: yup
    .string()
    .required("Bio is required")
    .min(5, "Bio must be at least 5 characters")
    .max(255, "Bio must not exceed 255 characters"),

  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be 15 digits or less"),

  gender: yup.mixed<GenderType>().required("Gender is required"),

  street: yup
    .string()
    .required("Street address is required")
    .min(2, "Street must be at least 2 characters")
    .max(100, "Street cannot exceed 100 characters"),

  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters"),

  state: yup
    .string()
    .required("State is required")
    .min(2, "State must be at least 2 characters")
    .max(50, "State cannot exceed 50 characters"),

  country: yup
    .string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country cannot exceed 50 characters"),

  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(4, "Must be at least 4 digits")
    .max(10, "Must be 10 digits or less"),

  isAddressVerified: yup
    .boolean()
    .required("Address verification status is required"),

  profilePic: yup
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

export const UpdateMemberSchema = yup.object().shape({
  fullName: yup
    .string()
    .optional()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),

  email: yup
    .string()
    .optional()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must not exceed 255 characters"),

  bio: yup
    .string()
    .optional()
    .min(5, "Bio must be at least 5 characters")
    .max(255, "Bio must not exceed 255 characters"),

  phoneNumber: yup
    .string()
    .optional()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be 15 digits or less"),

  gender: yup.mixed<GenderType>().optional(),
  street: yup
    .string()
    .optional()
    .min(2, "Street must be at least 2 characters")
    .max(100, "Street cannot exceed 100 characters"),

  city: yup
    .string()
    .optional()
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters"),

  state: yup
    .string()
    .optional()
    .min(2, "State must be at least 2 characters")
    .max(50, "State cannot exceed 50 characters"),

  country: yup
    .string()
    .optional()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country cannot exceed 50 characters"),

  pincode: yup
    .string()
    .optional()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(4, "Must be at least 4 digits")
    .max(10, "Must be 10 digits or less"),

  isAddressVerified: yup.boolean().optional(),

  profilePic: yup.mixed().optional(),
});
