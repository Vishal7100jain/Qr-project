"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordSchema = exports.UpdateProfileSchema = void 0;
const zod_1 = require("zod");
exports.UpdateProfileSchema = zod_1.z
    .object({
    username: zod_1.z
        .string()
        .min(3, "Username must be at least 3 characters")
        .optional(),
    email: zod_1.z.string().email("Invalid email format").optional(),
})
    .partial();
exports.ChangePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z
        .string()
        .min(6, "Current password must be at least 6 characters"),
    newPassword: zod_1.z.string().min(8, "New password must be at least 8 characters"),
});
