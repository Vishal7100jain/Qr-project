"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlanFeaturesQuerySchema = exports.UpdatePlanFeatureSchema = exports.CreatePlanFeatureSchema = void 0;
const zod_1 = require("zod");
const admin_enums_1 = require("../../constants/admin.enums");
const common_schema_1 = require("./common.schema");
// Plan Feature Schemas
exports.CreatePlanFeatureSchema = zod_1.z
    .object({
    feature: zod_1.z
        .string({ required_error: "Feature description is required" })
        .min(1, "Feature description cannot be empty")
        .max(500, "Feature description cannot exceed 500 characters")
        .trim(),
    planIds: zod_1.z
        .array(zod_1.z
        .string({
        required_error: "Plan Id is required to created plan feature.",
    })
        .length(24, "Invalid Id length.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."), {
        required_error: "Plan Id is required to be assign to a feature",
        invalid_type_error: "PlanIds must be an array of ids",
    })
        .min(1, "Minimum one plan is required to be assign, to create plan feature"),
    status: zod_1.z.nativeEnum(admin_enums_1.StatusEnum).optional().default(admin_enums_1.StatusEnum.ACTIVE),
})
    .refine((data) => new Set(data.planIds).size === data.planIds.length, {
    message: "All Plan Ids must be unique, no duplicate Ids allowed.",
});
exports.UpdatePlanFeatureSchema = zod_1.z
    .object({
    feature: zod_1.z
        .string()
        .min(1, "Feature description cannot be empty")
        .max(500, "Feature description cannot exceed 500 characters")
        .trim()
        .optional(),
    planIds: zod_1.z
        .array(zod_1.z
        .string({
        required_error: "Plan Id is required to created plan feature.",
    })
        .length(24, "Invalid Id length.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."), {
        required_error: "Plan Id is required to be assign to a feature",
        invalid_type_error: "PlanIds must be an array of ids",
    })
        .min(1, "Minimum one plan is required to be assign, to create plan feature"),
    status: zod_1.z.nativeEnum(admin_enums_1.StatusEnum).optional(),
})
    .refine((data) => !data.planIds || new Set(data.planIds).size === data.planIds.length, {
    message: "All Plan Ids must be unique, no duplicate Ids allowed.",
});
exports.GetPlanFeaturesQuerySchema = zod_1.z.object({
    page: common_schema_1.pageQuerySchema,
    pageSize: common_schema_1.pageSizeQuerySchema,
    search: common_schema_1.searchQuerySchema.optional(),
    status: zod_1.z
        .string()
        .transform((val) => (val ? Number(val) : undefined))
        .refine((val) => val === undefined || Object.values(admin_enums_1.StatusEnum).includes(val), {
        message: "Invalid status value",
    })
        .optional(),
});
