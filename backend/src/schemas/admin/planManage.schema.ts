import { z } from "zod";
import { StatusEnum } from "../../constants/admin.enums";
import { PlanTypeEnum } from "../../constants/enums";
import {
  pageQuerySchema,
  pageSizeQuerySchema,
  searchQuerySchema,
} from "./common.schema";

// Convert TS Enums to Zod enums
const PlanTypeZod = z.nativeEnum(PlanTypeEnum);
const StatusZod = z.nativeEnum(StatusEnum);

// Common price and discount object
const priceSchema = z.object(
  {
    monthly: z
      .number({ required_error: "Monthly Price of a Plan is required" })
      .nonnegative({ message: "Monthly price must be >= 0" }),
    yearly: z
      .number({ required_error: "Yearly Price of a Plan is required" })
      .nonnegative({ message: "Yearly price must be >= 0" }),
  },
  { required_error: "Monthly and yearly pricing is required" }
);

const discountSchema = z.object(
  {
    monthly: z.object(
      {
        amount: z
          .number({ required_error: "Monthly discount in price is required" })
          .nonnegative(),
        percentage: z
          .number({ required_error: "Monthly discount in % is required" })
          .min(0)
          .max(100),
      },
      { required_error: "Monthly amount and % of discount is required" }
    ),
    yearly: z.object(
      {
        amount: z
          .number({ required_error: "Yearly discount in price is required" })
          .nonnegative(),
        percentage: z
          .number({ required_error: "Yearly discount in % is required" })
          .min(0)
          .max(100),
      },
      { required_error: "Yearly amount and % of discount is required" }
    ),
  },
  { required_error: "Monthly and yearly discount is required" }
);

const limitsSchema = z.object(
  {
    maxPortfolio: z
      .number({
        required_error: "Maximum Portfolio creation limit is required",
      })
      .int()
      .nonnegative(),
    maxImagesPerPortfolio: z
      .number({
        required_error:
          "Number of maximum image upload per portfolio limit is required",
      })
      .int()
      .nonnegative(),
  },
  {
    required_error: "Max portfolio and max images per portfolio are required.",
  }
);

// Create plan schema
export const CreatePlanSchema = z
  .object({
    planType: PlanTypeZod,
    planName: z
      .string({ required_error: "Plan name is required" })
      .min(3, "Plan name must be atleast 3 character long")
      .max(50, "Plan cannot be greater than 50 characters")
      .trim(),
    price: priceSchema,
    discount: discountSchema,
    limits: limitsSchema,
    status: StatusZod.optional(),
    slug: z
      .string({ required_error: "Slug is required to create plan" })
      .min(3, "Slug must be at least 3 characters")
      .max(50, "Slug cannot be greater than 50 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Invalid slug format (use lowercase letters, numbers and hyphens)"
      ),
  })
  .refine((data) => data.price.monthly < data.price.yearly, {
    message: "Monthly price must be smaller than yearly price",
  });

export const UpdatePlanSchema = z.object({
  planType: PlanTypeZod.optional(),
  planName: z
    .string()
    .min(3, "Plan name must be atleast 3 character long")
    .max(50, "Plan cannot be greater than 50 characters")
    .trim()
    .optional(),
  price: priceSchema.optional(),
  discount: discountSchema.optional(),
  limits: limitsSchema.optional(),
  status: StatusZod.optional().optional(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug cannot be greater than 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Invalid slug format (use lowercase letters, numbers and hyphens)"
    )
    .optional(),
});

// TODO: review of this code pending and update schema pending
// Create Plan Feature schema
export const createPlanFeatureSchema = z.object({
  feature: z.string().min(1).trim(),
  planId: z.string().min(24),
  status: StatusZod.optional(),
});

// TODO: review of this code pending and update schema pending
// Create Plan FAQ schema
export const createPlanFAQSchema = z.object({
  question: z.string().min(1).trim(),
  answer: z.string().min(1).trim(),
  planId: z.string().min(24),
  status: StatusZod.optional(),
});

// Get Plans
export const GetPlanQuerySchema = z.object({
  page: pageQuerySchema,
  pageSize: pageSizeQuerySchema,
  planName: searchQuerySchema,
});
