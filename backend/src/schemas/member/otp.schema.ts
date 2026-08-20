import { z } from "zod";

// Common error messages as constants for reusability and consistency
const ERROR_MESSAGES = {
  OTP: {
    REQUIRED: "OTP is required",
    LENGTH: "OTP must be exactly 6 characters",
    REGEX: "OTP must contain only digits",
  },
  phoneNumberOTP: {
    REQUIRED: "Phone Number OTP is required",
    LENGTH: "Phone Number OTP must be exactly 6 characters",
    REGEX: "Phone Number OTP must contain only digits",
  },
  emailOTP: {
    REQUIRED: "Email OTP is required",
    LENGTH: "Email OTP must be exactly 6 characters",
    REGEX: "Email OTP must contain only digits",
  },
  EMAIL: "Invalid email address",
  PHONE: {
    LENGTH: "Phone number must be between 10 and 15 digits",
  },
  IDENTIFIER: "Either email or phone number is required",
};

export const verifyOtpSchema = z
  .object({
    otp: z
      .string({ required_error: ERROR_MESSAGES.OTP.REQUIRED })
      .length(6, ERROR_MESSAGES.OTP.LENGTH)
      .regex(/^\d+$/, { message: ERROR_MESSAGES.OTP.LENGTH }),

    email: z.string().email(ERROR_MESSAGES.EMAIL).optional(),
    number: z
      .string()
      .regex(/^\d+$/, "Phone number must contain only digits")
      .min(10, ERROR_MESSAGES.PHONE.LENGTH)
      .max(15, ERROR_MESSAGES.PHONE.LENGTH)
      .optional(),
  })
  .refine((data) => data.email || data.number, {
    message: ERROR_MESSAGES.IDENTIFIER,
    path: [], // Empty array makes the error global to the form
  });

export const sendOTPSignUpSchema = z.object({
  fullName: z
    .string({ required_error: "Full Name is required" })
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters"),

  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9+\-()\s]+$/, "Invalid phone number format"),
});

export const emailOTPSchema = z
  .number({ required_error: ERROR_MESSAGES.emailOTP.REQUIRED })
  .min(6, ERROR_MESSAGES.emailOTP.LENGTH);

export const verifyOTPSignUpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters"),

  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9+\-()\s]+$/, "Invalid phone number format"),

  emailOTP: emailOTPSchema,

  phoneNumberOTP: z
    .number({ required_error: ERROR_MESSAGES.phoneNumberOTP.REQUIRED })
    .min(6, ERROR_MESSAGES.phoneNumberOTP.LENGTH)
    .optional(),
});

export const verifyOTPLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters"),
  emailOTP: z
    .number({ required_error: ERROR_MESSAGES.emailOTP.REQUIRED })
    .min(6, ERROR_MESSAGES.emailOTP.LENGTH),
});
