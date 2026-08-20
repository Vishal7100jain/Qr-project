"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlanFAQSchema = exports.CreatePlanFAQSchema = void 0;
const zod_1 = require("zod");
const admin_enums_1 = require("../../constants/admin.enums");
// Plan FAQ Schemas
exports.CreatePlanFAQSchema = zod_1.z
    .object({
    question: zod_1.z
        .string({ required_error: "Question is required" })
        .min(1, "Question cannot be empty")
        .max(255, "Question cannot exceed 255 characters")
        .trim(),
    answer: zod_1.z
        .string({ required_error: "Answer is required" })
        .min(1, "Answer cannot be empty")
        .max(2000, "Answer cannot exceed 2000 characters")
        .trim(),
    planIds: zod_1.z
        .array(zod_1.z
        .string({
        required_error: "Plan Id is required to created plan FAQ.",
    })
        .length(24, "Invalid Id length.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."), {
        required_error: "Plan Id is required to be assign to a FAQ.",
        invalid_type_error: "PlanIds must be an array of ids",
    })
        .min(1, "Minimum one plan is required to be assign, to create plan FAQ."),
    status: zod_1.z.nativeEnum(admin_enums_1.StatusEnum).optional().default(admin_enums_1.StatusEnum.ACTIVE),
})
    .refine((data) => new Set(data.planIds).size === data.planIds.length, {
    message: "All Plan Ids must be unique, no duplicate Ids allowed.",
});
exports.UpdatePlanFAQSchema = zod_1.z
    .object({
    question: zod_1.z
        .string()
        .min(1, "Question cannot be empty")
        .max(255, "Question cannot exceed 255 characters")
        .trim()
        .optional(),
    answer: zod_1.z
        .string()
        .min(1, "Answer cannot be empty")
        .max(2000, "Answer cannot exceed 2000 characters")
        .trim()
        .optional(),
    planIds: zod_1.z
        .array(zod_1.z
        .string({
        required_error: "Plan Id is required to created plan FAQ.",
    })
        .length(24, "Invalid Id length.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."), {
        required_error: "Plan Id is required to be assign to a FAQ.",
        invalid_type_error: "PlanIds must be an array of ids",
    })
        .optional(),
    status: zod_1.z.nativeEnum(admin_enums_1.StatusEnum).optional(),
})
    .refine((data) => !data.planIds || new Set(data.planIds).size === data.planIds.length, {
    message: "All Plan Ids must be unique, no duplicate Ids allowed.",
});
