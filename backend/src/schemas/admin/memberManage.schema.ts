import { z } from "zod";
import { GenderEnum } from "../../constants/enums";
import {
  citySchema,
  email,
  fullName,
  phoneNumber,
  pincodeSchema,
  stateSchema,
} from "../member/memberAuth.schema";

export const CreateMemberSchema = z
  .object({
    fullName,
    email,
    phoneNumber,
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

    isAddressVerified: z.preprocess(
      (val) => {
        if (val === "true" || val === true) return true;
        if (val === "false" || val === false) return false;
        return val;
      },
      z.boolean({
        required_error: "Address Verification Status is required",
      })
    ),

    gender: z
      .union([
        z.nativeEnum(GenderEnum),
        z.string().transform((val) => {
          const parsed = parseInt(val, 10);
          if (isNaN(parsed)) return val;
          return parsed as GenderEnum;
        }),
      ])
      .pipe(
        z.nativeEnum(GenderEnum, {
          invalid_type_error:
            "Please enter a valid Gender: FEMALE (1), MALE (2).",
        })
      ),
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

export const UpdateMemberSchema = z
  .object({
    fullName: fullName.optional(),
    email: email.optional(),
    phoneNumber: phoneNumber.optional(),
    street: z
      .string({ invalid_type_error: "Street address type is invalid" })
      .min(2, "Street must be at least 2 characters")
      .max(100, "Street cannot exceed 100 characters")
      .optional(),
    city: citySchema.optional(),
    state: stateSchema.optional(),
    pincode: pincodeSchema.optional(),
    country: z
      .string({ invalid_type_error: "Country type is invalid" })
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country cannot exceed 50 characters")
      .optional(),

    isAddressVerified: z
      .preprocess(
        (val) => {
          if (val === "true" || val === true) return true;
          if (val === "false" || val === false) return false;
          return val;
        },
        z.boolean({
          invalid_type_error: "Invalid Address Verification Status",
        })
      )
      .optional(),

    gender: z
      .union([
        z.nativeEnum(GenderEnum),
        z.string().transform((val) => {
          const parsed = parseInt(val, 10);
          if (isNaN(parsed)) return val;
          return parsed as GenderEnum;
        }),
      ])
      .pipe(
        z.nativeEnum(GenderEnum, {
          invalid_type_error:
            "Please enter a valid Gender: FEMALE (1), MALE (2).",
        })
      )
      .optional(),
  })
  .optional();
