"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMemberSchema = exports.CreateMemberSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../constants/enums");
const memberAuth_schema_1 = require("../member/memberAuth.schema");
exports.CreateMemberSchema = zod_1.z
    .object({
    fullName: memberAuth_schema_1.fullName,
    email: memberAuth_schema_1.email,
    phoneNumber: memberAuth_schema_1.phoneNumber,
    street: zod_1.z
        .string({ required_error: "Street address is required" })
        .min(2, "Street must be at least 2 characters")
        .max(100, "Street cannot exceed 100 characters"),
    city: memberAuth_schema_1.citySchema,
    state: memberAuth_schema_1.stateSchema,
    pincode: memberAuth_schema_1.pincodeSchema,
    country: zod_1.z
        .string({ required_error: "Country is required" })
        .min(2, "Country must be at least 2 characters")
        .max(50, "Country cannot exceed 50 characters"),
    isAddressVerified: zod_1.z.preprocess((val) => {
        if (val === "true" || val === true)
            return true;
        if (val === "false" || val === false)
            return false;
        return val;
    }, zod_1.z.boolean({
        required_error: "Address Verification Status is required",
    })),
    gender: zod_1.z
        .union([
        zod_1.z.nativeEnum(enums_1.GenderEnum),
        zod_1.z.string().transform((val) => {
            const parsed = parseInt(val, 10);
            if (isNaN(parsed))
                return val;
            return parsed;
        }),
    ])
        .pipe(zod_1.z.nativeEnum(enums_1.GenderEnum, {
        invalid_type_error: "Please enter a valid Gender: FEMALE (1), MALE (2).",
    })),
})
    .refine((data) => Object.values(data).every((field) => field !== undefined && field !== null && field !== ""), {
    message: "All fields are required. Please fill in all details.",
    path: [], // Applies to the entire object
});
exports.UpdateMemberSchema = zod_1.z
    .object({
    fullName: memberAuth_schema_1.fullName.optional(),
    email: memberAuth_schema_1.email.optional(),
    phoneNumber: memberAuth_schema_1.phoneNumber.optional(),
    street: zod_1.z
        .string({ invalid_type_error: "Street address type is invalid" })
        .min(2, "Street must be at least 2 characters")
        .max(100, "Street cannot exceed 100 characters")
        .optional(),
    city: memberAuth_schema_1.citySchema.optional(),
    state: memberAuth_schema_1.stateSchema.optional(),
    pincode: memberAuth_schema_1.pincodeSchema.optional(),
    country: zod_1.z
        .string({ invalid_type_error: "Country type is invalid" })
        .min(2, "Country must be at least 2 characters")
        .max(50, "Country cannot exceed 50 characters")
        .optional(),
    isAddressVerified: zod_1.z
        .preprocess((val) => {
        if (val === "true" || val === true)
            return true;
        if (val === "false" || val === false)
            return false;
        return val;
    }, zod_1.z.boolean({
        invalid_type_error: "Invalid Address Verification Status",
    }))
        .optional(),
    gender: zod_1.z
        .union([
        zod_1.z.nativeEnum(enums_1.GenderEnum),
        zod_1.z.string().transform((val) => {
            const parsed = parseInt(val, 10);
            if (isNaN(parsed))
                return val;
            return parsed;
        }),
    ])
        .pipe(zod_1.z.nativeEnum(enums_1.GenderEnum, {
        invalid_type_error: "Please enter a valid Gender: FEMALE (1), MALE (2).",
    }))
        .optional(),
})
    .optional();
