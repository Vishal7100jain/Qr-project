"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlanQuerySchema = exports.createPlanFAQSchema = exports.createPlanFeatureSchema = exports.UpdatePlanSchema = exports.CreatePlanSchema = void 0;
const zod_1 = require("zod");
const admin_enums_1 = require("../../constants/admin.enums");
const enums_1 = require("../../constants/enums");
const common_schema_1 = require("./common.schema");
// Convert TS Enums to Zod enums
const PlanTypeZod = zod_1.z.nativeEnum(enums_1.PlanTypeEnum);
const StatusZod = zod_1.z.nativeEnum(admin_enums_1.StatusEnum);
// Common price and discount object
const priceSchema = zod_1.z.object({
    monthly: zod_1.z
        .number({ required_error: "Monthly Price of a Plan is required" })
        .nonnegative({ message: "Monthly price must be >= 0" }),
    yearly: zod_1.z
        .number({ required_error: "Yearly Price of a Plan is required" })
        .nonnegative({ message: "Yearly price must be >= 0" }),
}, { required_error: "Monthly and yearly pricing is required" });
const discountSchema = zod_1.z.object({
    monthly: zod_1.z.object({
        amount: zod_1.z
            .number({ required_error: "Monthly discount in price is required" })
            .nonnegative(),
        percentage: zod_1.z
            .number({ required_error: "Monthly discount in % is required" })
            .min(0)
            .max(100),
    }, { required_error: "Monthly amount and % of discount is required" }),
    yearly: zod_1.z.object({
        amount: zod_1.z
            .number({ required_error: "Yearly discount in price is required" })
            .nonnegative(),
        percentage: zod_1.z
            .number({ required_error: "Yearly discount in % is required" })
            .min(0)
            .max(100),
    }, { required_error: "Yearly amount and % of discount is required" }),
}, { required_error: "Monthly and yearly discount is required" });
const limitsSchema = zod_1.z.object({
    maxPortfolio: zod_1.z
        .number({
        required_error: "Maximum Portfolio creation limit is required",
    })
        .int()
        .nonnegative(),
    maxImagesPerPortfolio: zod_1.z
        .number({
        required_error: "Number of maximum image upload per portfolio limit is required",
    })
        .int()
        .nonnegative(),
}, {
    required_error: "Max portfolio and max images per portfolio are required.",
});
// Create plan schema
exports.CreatePlanSchema = zod_1.z
    .object({
    planType: PlanTypeZod,
    planName: zod_1.z
        .string({ required_error: "Plan name is required" })
        .min(3, "Plan name must be atleast 3 character long")
        .max(50, "Plan cannot be greater than 50 characters")
        .trim(),
    price: priceSchema,
    discount: discountSchema,
    limits: limitsSchema,
    status: StatusZod.optional(),
    slug: zod_1.z
        .string({ required_error: "Slug is required to create plan" })
        .min(3, "Slug must be at least 3 characters")
        .max(50, "Slug cannot be greater than 50 characters")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (use lowercase letters, numbers and hyphens)"),
})
    .refine((data) => data.price.monthly < data.price.yearly, {
    message: "Monthly price must be smaller than yearly price",
});
exports.UpdatePlanSchema = zod_1.z.object({
    planType: PlanTypeZod.optional(),
    planName: zod_1.z
        .string()
        .min(3, "Plan name must be atleast 3 character long")
        .max(50, "Plan cannot be greater than 50 characters")
        .trim()
        .optional(),
    price: priceSchema.optional(),
    discount: discountSchema.optional(),
    limits: limitsSchema.optional(),
    status: StatusZod.optional().optional(),
    slug: zod_1.z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(50, "Slug cannot be greater than 50 characters")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (use lowercase letters, numbers and hyphens)")
        .optional(),
});
// TODO: review of this code pending and update schema pending
// Create Plan Feature schema
exports.createPlanFeatureSchema = zod_1.z.object({
    feature: zod_1.z.string().min(1).trim(),
    planId: zod_1.z.string().min(24),
    status: StatusZod.optional(),
});
// TODO: review of this code pending and update schema pending
// Create Plan FAQ schema
exports.createPlanFAQSchema = zod_1.z.object({
    question: zod_1.z.string().min(1).trim(),
    answer: zod_1.z.string().min(1).trim(),
    planId: zod_1.z.string().min(24),
    status: StatusZod.optional(),
});
// Get Plans
exports.GetPlanQuerySchema = zod_1.z.object({
    page: common_schema_1.pageQuerySchema,
    pageSize: common_schema_1.pageSizeQuerySchema,
    planName: common_schema_1.searchQuerySchema,
});
