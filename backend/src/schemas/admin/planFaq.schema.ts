import { z } from "zod";
import { StatusEnum } from "../../constants/admin.enums";

// Plan FAQ Schemas
export const CreatePlanFAQSchema = z
  .object({
    question: z
      .string({ required_error: "Question is required" })
      .min(1, "Question cannot be empty")
      .max(255, "Question cannot exceed 255 characters")
      .trim(),
    answer: z
      .string({ required_error: "Answer is required" })
      .min(1, "Answer cannot be empty")
      .max(2000, "Answer cannot exceed 2000 characters")
      .trim(),
    planIds: z
      .array(
        z
          .string({
            required_error: "Plan Id is required to created plan FAQ.",
          })
          .length(24, "Invalid Id length.")
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
        {
          required_error: "Plan Id is required to be assign to a FAQ.",
          invalid_type_error: "PlanIds must be an array of ids",
        }
      )
      .min(1, "Minimum one plan is required to be assign, to create plan FAQ."),
    status: z.nativeEnum(StatusEnum).optional().default(StatusEnum.ACTIVE),
  })
  .refine((data) => new Set(data.planIds).size === data.planIds.length, {
    message: "All Plan Ids must be unique, no duplicate Ids allowed.",
  });

export const UpdatePlanFAQSchema = z
  .object({
    question: z
      .string()
      .min(1, "Question cannot be empty")
      .max(255, "Question cannot exceed 255 characters")
      .trim()
      .optional(),
    answer: z
      .string()
      .min(1, "Answer cannot be empty")
      .max(2000, "Answer cannot exceed 2000 characters")
      .trim()
      .optional(),
    planIds: z
      .array(
        z
          .string({
            required_error: "Plan Id is required to created plan FAQ.",
          })
          .length(24, "Invalid Id length.")
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
        {
          required_error: "Plan Id is required to be assign to a FAQ.",
          invalid_type_error: "PlanIds must be an array of ids",
        }
      )
      .optional(),
    status: z.nativeEnum(StatusEnum).optional(),
  })
  .refine(
    (data) =>
      !data.planIds || new Set(data.planIds).size === data.planIds.length,
    {
      message: "All Plan Ids must be unique, no duplicate Ids allowed.",
    }
  );
