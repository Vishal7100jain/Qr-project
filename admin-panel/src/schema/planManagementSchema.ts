import { PlanStatusEnum, PlanTypeEnum } from "@/constants/adminEnum";
import * as yup from "yup";

// helper to convert enum to string array
const numericEnum = (e: object) =>
  Object.values(e).filter((v) => typeof v === "number") as number[];

/* -------------------- CREATE PLAN -------------------- */
export const CreatePlanSchema = yup.object().shape({
  planType: yup
    .number()
    .oneOf(numericEnum(PlanTypeEnum), "Invalid plan type")
    .required("Plan type is required"),

  planName: yup
    .string()
    .required("Plan name is required")
    .min(3, "Plan name must be at least 3 characters")
    .max(200, "Plan name must not exceed 200 characters"),

  slug: yup
    .string()
    .required("Slug is required")
    .min(3, "Slug must be at least 3 characters")
    .max(210, "Slug must not exceed 210 characters"),

  price: yup
    .object({
      monthly: yup
        .number()
        .required("Monthly price is required")
        .min(0, "Price must be positive"),
      yearly: yup
        .number()
        .required("Yearly price is required")
        .min(0, "Price must be positive"),
    })
    .required(),

  discount: yup
    .object({
      monthly: yup.object({
        amount: yup
          .number()
          .required("Monthly discount amount is required")
          .min(0, "Must be >= 0"),
        percentage: yup
          .number()
          .required("Monthly discount % is required")
          .min(0)
          .max(100, "Discount % cannot exceed 100"),
      }),
      yearly: yup.object({
        amount: yup
          .number()
          .required("Yearly discount amount is required")
          .min(0, "Must be >= 0"),
        percentage: yup
          .number()
          .required("Yearly discount % is required")
          .min(0)
          .max(100, "Discount % cannot exceed 100"),
      }),
    })
    .required(),

  limits: yup
    .object({
      maxPortfolio: yup
        .number()
        .required("Max portfolio is required")
        .min(1, "Must be at least 1"),
      maxImagesPerPortfolio: yup
        .number()
        .required("Max images per portfolio is required")
        .min(1, "Must be at least 1"),
    })
    .required(),

  status: yup
    .number()
    .oneOf(numericEnum(PlanStatusEnum), "Invalid status")
    .default(PlanStatusEnum.ACTIVE),
});

/* -------------------- UPDATE PLAN -------------------- */
export const UpdatePlanSchema = CreatePlanSchema.shape({
  planType: yup.number().optional(),
  planName: yup.string().optional(),
  slug: yup.string().optional(),
  price: yup.object().shape({
    monthly: yup.number().optional(),
    yearly: yup.number().optional(),
  }),
  discount: yup.object().shape({
    monthly: yup.object({
      amount: yup.number().optional(),
      percentage: yup.number().optional(),
    }),
    yearly: yup.object({
      amount: yup.number().optional(),
      percentage: yup.number().optional(),
    }),
  }),
  limits: yup.object().shape({
    maxPortfolio: yup.number().optional(),
    maxImagesPerPortfolio: yup.number().optional(),
  }),
  status: yup.number().optional(),
});
