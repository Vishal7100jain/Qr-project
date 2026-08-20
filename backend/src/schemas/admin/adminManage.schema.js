"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdminSchema = exports.CreateAdminSchema = exports.GetAdminQuerySchema = void 0;
const zod_1 = require("zod");
const admin_enums_1 = require("../../constants/admin.enums");
const common_schema_1 = require("./common.schema");
exports.GetAdminQuerySchema = zod_1.z.object({
    page: common_schema_1.pageQuerySchema,
    pageSize: common_schema_1.pageSizeQuerySchema,
    search: common_schema_1.searchQuerySchema,
    status: zod_1.z
        .string()
        .transform((val) => (val ? Number(val) : undefined))
        .refine((val) => val === undefined || Object.values(admin_enums_1.StatusEnum).includes(val), {
        message: "Invalid status value",
    })
        .optional(),
});
exports.CreateAdminSchema = zod_1.z.object({
    username: zod_1.z
        .string({
        required_error: "Username is required.",
        invalid_type_error: "Please enter a valid Username.",
    })
        .min(3, "Username must be at least 3 characters long.")
        .max(30, "Username must not exceed 30 characters."),
    email: zod_1.z
        .string({
        required_error: "Email is required.",
        invalid_type_error: "Please enter a valid Email.",
    })
        .email("Invalid email format.")
        .min(5, "Email must be at least 5 characters long.")
        .max(255, "Email must not exceed 255 characters."),
    contactNumber: zod_1.z
        .string({
        required_error: "Contact Number is required.",
        invalid_type_error: "Please enter a valid Email.",
    })
        .min(10, "Contact Number must be at least 10 characters long.")
        .max(15, "Email must not exceed 15 characters."),
    password: zod_1.z
        .string({ required_error: "password is required." })
        .min(8, "Password must be at least 8 characters.")
        .max(15, "Password must not exceed 15 characters.")
        .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter.")
        .refine((val) => /[a-z]/.test(val), "Password must contain at least one lowercase letter.")
        .refine((val) => /[0-9]/.test(val), "Password must contain at least one number.")
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "Password must contain at least one special character."),
    roleId: common_schema_1.mongooseIdValidationSchema,
    status: zod_1.z
        .union([
        zod_1.z.nativeEnum(admin_enums_1.AdminStatus), // Accepts enum values directly (e.g., AdminStatus.Active)
        zod_1.z.string().transform((val) => {
            // Accepts string numbers ("1", "2", etc.)
            const parsed = parseInt(val, 10);
            if (isNaN(parsed))
                return val; // Fallback (will fail nativeEnum check)
            return parsed; // Convert to number (enum)
        }),
    ])
        .pipe(zod_1.z.nativeEnum(admin_enums_1.AdminStatus, {
        invalid_type_error: "Please enter a valid Status: Active (1), Inactive (2), or Suspended (3).",
    }))
        .optional(),
});
exports.UpdateAdminSchema = zod_1.z
    .object({
    username: zod_1.z
        .string({
        invalid_type_error: "Please enter a valid Username.",
    })
        .min(3, "Username must be at least 3 characters long.")
        .max(30, "Username must not exceed 30 characters.")
        .optional(),
    email: zod_1.z
        .string({
        invalid_type_error: "Please enter a valid Email.",
    })
        .email("Invalid email format.")
        .min(5, "Email must be at least 5 characters long.")
        .max(255, "Email must not exceed 255 characters.")
        .optional(),
    contactNumber: zod_1.z
        .string()
        .min(10, "Contact Number must be at least 10 characters long.")
        .max(15, "Contact Number must not exceed 15 characters.") // Fixed error message
        .optional(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(15, "Password must not exceed 15 characters.")
        .refine((val) => /[A-Z]/.test(val), "Password must contain at least one uppercase letter.")
        .refine((val) => /[a-z]/.test(val), "Password must contain at least one lowercase letter.")
        .refine((val) => /[0-9]/.test(val), "Password must contain at least one number.")
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "Password must contain at least one special character.")
        .optional(),
    roleId: common_schema_1.mongooseIdValidationSchema.optional(),
    profilePhotoFile: zod_1.z
        .any()
        .refine((val) => {
        // If no file was provided, that's fine (optional)
        if (!val)
            return true;
        // Check if it's a File object (browser) or has file properties (Node.js/multer)
        return (val instanceof File ||
            (typeof val === "object" &&
                "fieldname" in val &&
                "originalname" in val));
    }, "Must be a valid file")
        .optional(),
    status: zod_1.z
        .union([
        zod_1.z.nativeEnum(admin_enums_1.AdminStatus), // Accepts enum values directly (e.g., AdminStatus.Active)
        zod_1.z.string().transform((val) => {
            // Accepts string numbers ("1", "2", etc.)
            const parsed = parseInt(val, 10);
            if (isNaN(parsed))
                return val; // Fallback (will fail nativeEnum check)
            return parsed; // Convert to number (enum)
        }),
    ])
        .optional(),
})
    .optional();
