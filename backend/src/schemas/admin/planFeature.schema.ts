import { z } from "zod";
import { StatusEnum } from "../../constants/admin.enums";
import {
  pageQuerySchema,
  pageSizeQuerySchema,
  searchQuerySchema,
} from "./common.schema";

// Plan Feature Schemas
export const CreatePlanFeatureSchema = z
  .object({
    feature: z
      .string({ required_error: "Feature description is required" })
      .min(1, "Feature description cannot be empty")
      .max(500, "Feature description cannot exceed 500 characters")
      .trim(),
    planIds: z
      .array(
        z
          .string({
            required_error: "Plan Id is required to created plan feature.",
          })
          .length(24, "Invalid Id length.")
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
        {
          required_error: "Plan Id is required to be assign to a feature",
          invalid_type_error: "PlanIds must be an array of ids",
        }
      )
      .min(
        1,
        "Minimum one plan is required to be assign, to create plan feature"
      ),
    status: z.nativeEnum(StatusEnum).optional().default(StatusEnum.ACTIVE),
  })
  .refine((data) => new Set(data.planIds).size === data.planIds.length, {
    message: "All Plan Ids must be unique, no duplicate Ids allowed.",
  });

export const UpdatePlanFeatureSchema = z
  .object({
    feature: z
      .string()
      .min(1, "Feature description cannot be empty")
      .max(500, "Feature description cannot exceed 500 characters")
      .trim()
      .optional(),
    planIds: z
      .array(
        z
          .string({
            required_error: "Plan Id is required to created plan feature.",
          })
          .length(24, "Invalid Id length.")
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
        {
          required_error: "Plan Id is required to be assign to a feature",
          invalid_type_error: "PlanIds must be an array of ids",
        }
      )
      .min(
        1,
        "Minimum one plan is required to be assign, to create plan feature"
      ),
    status: z.nativeEnum(StatusEnum).optional(),
  })
  .refine(
    (data) =>
      !data.planIds || new Set(data.planIds).size === data.planIds.length,
    {
      message: "All Plan Ids must be unique, no duplicate Ids allowed.",
    }
  );

export const GetPlanFeaturesQuerySchema = z.object({
  page: pageQuerySchema,
  pageSize: pageSizeQuerySchema,
  search: searchQuerySchema.optional(),
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
