"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoginSchema = void 0;
const zod_1 = require("zod");
const password = zod_1.z
    .string({
    required_error: "Password is required",
    invalid_type_error: "Please enter a valid Password",
})
    .min(2, "Password must be at least 2 characters")
    .max(15, "Password should not exceed 15 characters");
exports.AdminLoginSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Admin Email is required",
        invalid_type_error: "Please enter a valid Email",
    })
        .email("Invalid email format")
        .min(5, "Email must be at least 5 characters")
        .max(50, "Email should not exceed 50 characters"),
    password,
});
