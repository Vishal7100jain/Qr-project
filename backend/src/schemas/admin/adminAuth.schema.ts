import { z } from "zod";

const password = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Please enter a valid Password",
  })
  .min(2, "Password must be at least 2 characters")
  .max(15, "Password should not exceed 15 characters");

export const AdminLoginSchema = z.object({
  email: z
    .string({
      required_error: "Admin Email is required",
      invalid_type_error: "Please enter a valid Email",
    })
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(50, "Email should not exceed 50 characters"),
  password,
});
