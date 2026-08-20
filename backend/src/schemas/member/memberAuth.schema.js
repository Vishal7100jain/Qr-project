"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberSignUpSchema = exports.pincodeSchema = exports.stateSchema = exports.citySchema = exports.oAuthLoginSchema = exports.MemberLoginSchema = exports.phoneNumber = exports.email = exports.fullName = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../constants/enums");
exports.fullName = zod_1.z
    .string({
    required_error: "Full Name is required",
    invalid_type_error: "Please enter a valid full name",
})
    .min(2, "Full name must be at least 2 characters long")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces");
exports.email = zod_1.z
    .string({
    required_error: "Email is required",
    invalid_type_error: "Please enter a valid Email",
})
    .email("Invalid email address")
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(255, "Email cannot exceed 255 characters");
exports.phoneNumber = zod_1.z
    .string({
    required_error: "Phone number is required",
    invalid_type_error: "Please enter a valid Phone Number",
})
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9+\-()\s]+$/, "Invalid phone number format");
exports.MemberLoginSchema = zod_1.z.object({
    email: exports.email,
});
exports.oAuthLoginSchema = exports.MemberLoginSchema.extend({
    provider: zod_1.z.nativeEnum(enums_1.AuthType, { required_error: "Provider is required" }),
    access_token: zod_1.z.string({ required_error: "Access token is required" }).trim(),
});
exports.citySchema = zod_1.z
    .string({ required_error: "City is required" })
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters");
exports.stateSchema = zod_1.z
    .string({ required_error: "State is required" })
    .min(2, "State must be at least 2 characters")
    .max(50, "State cannot exceed 50 characters");
exports.pincodeSchema = zod_1.z
    .string({ required_error: "Pincode is required" })
    .min(3, "Pincode must be at least 3 characters")
    .max(20, "Pincode cannot exceed 20 characters")
    .length(6, { message: "Pincode must be 6 digits" })
    .regex(/^\d{6}$/, { message: "Invalid pincode format" });
exports.MemberSignUpSchema = zod_1.z
    .object({
    fullName: exports.fullName,
    email: exports.email,
    phoneNumber: exports.phoneNumber,
    address: zod_1.z.object({
        street: zod_1.z
            .string({ required_error: "Street address is required" })
            .min(2, "Street must be at least 2 characters")
            .max(100, "Street cannot exceed 100 characters"),
        city: exports.citySchema,
        state: exports.stateSchema,
        pincode: exports.pincodeSchema,
        country: zod_1.z
            .string({ required_error: "Country is required" })
            .min(2, "Country must be at least 2 characters")
            .max(50, "Country cannot exceed 50 characters"),
        isAddressVerified: zod_1.z.boolean({
            required_error: "Address Verification Status is required",
        }),
    }, { required_error: "Address is required" }),
    gender: zod_1.z.nativeEnum(enums_1.GenderEnum, {
        required_error: "Gender is required",
    }),
})
    .refine((data) => Object.values(data).every((field) => field !== undefined && field !== null && field !== ""), {
    message: "All fields are required. Please fill in all details.",
    path: [], // Applies to the entire object
});
