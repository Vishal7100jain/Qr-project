import { z } from "zod";
import { AuthType, GenderEnum } from "../../constants/enums";

export const fullName = z
  .string({
    required_error: "Full Name is required",
    invalid_type_error: "Please enter a valid full name",
  })
  .min(2, "Full name must be at least 2 characters long")
  .max(100, "Full name cannot exceed 100 characters")
  .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces");

export const email = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Please enter a valid Email",
  })
  .email("Invalid email address")
  .min(5, { message: "Email must be at least 5 characters long" })
  .max(255, "Email cannot exceed 255 characters");

export const phoneNumber = z
  .string({
    required_error: "Phone number is required",
    invalid_type_error: "Please enter a valid Phone Number",
  })
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number cannot exceed 15 digits")
  .regex(/^[0-9+\-()\s]+$/, "Invalid phone number format");

export const MemberLoginSchema = z.object({
  email,
});

export const oAuthLoginSchema = MemberLoginSchema.extend({
  provider: z.nativeEnum(AuthType, { required_error: "Provider is required" }),
  access_token: z.string({ required_error: "Access token is required" }).trim(),
});

export const citySchema = z
  .string({ required_error: "City is required" })
  .min(2, "City must be at least 2 characters")
  .max(50, "City cannot exceed 50 characters");

export const stateSchema = z
  .string({ required_error: "State is required" })
  .min(2, "State must be at least 2 characters")
  .max(50, "State cannot exceed 50 characters");

export const pincodeSchema = z
  .string({ required_error: "Pincode is required" })
  .min(3, "Pincode must be at least 3 characters")
  .max(20, "Pincode cannot exceed 20 characters")
  .length(6, { message: "Pincode must be 6 digits" })
  .regex(/^\d{6}$/, { message: "Invalid pincode format" });

export const MemberSignUpSchema = z
  .object({
    fullName,
    email,
    phoneNumber,
    address: z.object(
      {
        street: z
          .string({ required_error: "Street address is required" })
          .min(2, "Street must be at least 2 characters")
          .max(100, "Street cannot exceed 100 characters"),
        city: citySchema,
        state: stateSchema,
        pincode: pincodeSchema,
        country: z
          .string({ required_error: "Country is required" })
          .min(2, "Country must be at least 2 characters")
          .max(50, "Country cannot exceed 50 characters"),

        isAddressVerified: z.boolean({
          required_error: "Address Verification Status is required",
        }),
      },
      { required_error: "Address is required" }
    ),

    gender: z.nativeEnum(GenderEnum, {
      required_error: "Gender is required",
    }),
  })
  .refine(
    (data) =>
      Object.values(data).every(
        (field) => field !== undefined && field !== null && field !== ""
      ),
    {
      message: "All fields are required. Please fill in all details.",
      path: [], // Applies to the entire object
    }
  );
