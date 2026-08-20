import { z } from "zod";

export const MemberSubscriberSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" })
    .min(5, { message: "Email must be at least 5 characters long" }),
});
