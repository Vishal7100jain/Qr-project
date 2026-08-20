import { z } from "zod";
import { AdminStatus, StatusEnum } from "../../constants/admin.enums";
import {
  mongooseIdValidationSchema,
  pageQuerySchema,
  pageSizeQuerySchema,
  searchQuerySchema,
} from "./common.schema";

export const GetAdminQuerySchema = z.object({
  page: pageQuerySchema,
  pageSize: pageSizeQuerySchema,
  search: searchQuerySchema,
  status: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine(
      (val) => val === undefined || Object.values(StatusEnum).includes(val),
      {
        message: "Invalid status value",
      }
    )
    .optional(),
});

export const CreateAdminSchema = z.object({
  username: z
    .string({
      required_error: "Username is required.",
      invalid_type_error: "Please enter a valid Username.",
    })
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username must not exceed 30 characters."),
  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Please enter a valid Email.",
    })
    .email("Invalid email format.")
    .min(5, "Email must be at least 5 characters long.")
    .max(255, "Email must not exceed 255 characters."),
  contactNumber: z
    .string({
      required_error: "Contact Number is required.",
      invalid_type_error: "Please enter a valid Email.",
    })
    .min(10, "Contact Number must be at least 10 characters long.")
    .max(15, "Email must not exceed 15 characters."),
  password: z
    .string({ required_error: "password is required." })
    .min(8, "Password must be at least 8 characters.")
    .max(15, "Password must not exceed 15 characters.")
    .refine(
      (val) => /[A-Z]/.test(val),
      "Password must contain at least one uppercase letter."
    )
    .refine(
      (val) => /[a-z]/.test(val),
      "Password must contain at least one lowercase letter."
    )
    .refine(
      (val) => /[0-9]/.test(val),
      "Password must contain at least one number."
    )
    .refine(
      (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
      "Password must contain at least one special character."
    ),
  roleId: mongooseIdValidationSchema,
  status: z
    .union([
      z.nativeEnum(AdminStatus), // Accepts enum values directly (e.g., AdminStatus.Active)
      z.string().transform((val) => {
        // Accepts string numbers ("1", "2", etc.)
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) return val; // Fallback (will fail nativeEnum check)
        return parsed as AdminStatus; // Convert to number (enum)
      }),
    ])
    .pipe(
      z.nativeEnum(AdminStatus, {
        invalid_type_error:
          "Please enter a valid Status: Active (1), Inactive (2), or Suspended (3).",
      })
    )
    .optional(),
});

export const UpdateAdminSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Please enter a valid Username.",
      })
      .min(3, "Username must be at least 3 characters long.")
      .max(30, "Username must not exceed 30 characters.")
      .optional(),
    email: z
      .string({
        invalid_type_error: "Please enter a valid Email.",
      })
      .email("Invalid email format.")
      .min(5, "Email must be at least 5 characters long.")
      .max(255, "Email must not exceed 255 characters.")
      .optional(),
    contactNumber: z
      .string()
      .min(10, "Contact Number must be at least 10 characters long.")
      .max(15, "Contact Number must not exceed 15 characters.") // Fixed error message
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(15, "Password must not exceed 15 characters.")
      .refine(
        (val) => /[A-Z]/.test(val),
        "Password must contain at least one uppercase letter."
      )
      .refine(
        (val) => /[a-z]/.test(val),
        "Password must contain at least one lowercase letter."
      )
      .refine(
        (val) => /[0-9]/.test(val),
        "Password must contain at least one number."
      )
      .refine(
        (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
        "Password must contain at least one special character."
      )
      .optional(),
    roleId: mongooseIdValidationSchema.optional(),
    profilePhotoFile: z
      .any()
      .refine((val) => {
        // If no file was provided, that's fine (optional)
        if (!val) return true;

        // Check if it's a File object (browser) or has file properties (Node.js/multer)
        return (
          val instanceof File ||
          (typeof val === "object" &&
            "fieldname" in val &&
            "originalname" in val)
        );
      }, "Must be a valid file")
      .optional(),

    status: z
      .union([
        z.nativeEnum(AdminStatus), // Accepts enum values directly (e.g., AdminStatus.Active)
        z.string().transform((val) => {
          // Accepts string numbers ("1", "2", etc.)
          const parsed = parseInt(val, 10);
          if (isNaN(parsed)) return val; // Fallback (will fail nativeEnum check)
          return parsed as AdminStatus; // Convert to number (enum)
        }),
      ])
      .optional(),
  })
  .optional();
