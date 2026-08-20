"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageListQuerySchema = exports.IdSchemaGet = exports.IdSchemaDelete = exports.IdSchemaUpdate = exports.mongooseIdValidationSchema = exports.statusQuerySchema = exports.searchQuerySchema = exports.pageSizeQuerySchema = exports.pageQuerySchema = void 0;
const zod_1 = require("zod");
const admin_enums_1 = require("../../constants/admin.enums");
const enums_1 = require("../../constants/enums");
exports.pageQuerySchema = zod_1.z.coerce.number().int().min(1).default(1);
exports.pageSizeQuerySchema = zod_1.z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10);
exports.searchQuerySchema = zod_1.z.coerce.string().trim().default("");
exports.statusQuerySchema = zod_1.z
    .union([
    // Try StatusEnum first
    zod_1.z.nativeEnum(admin_enums_1.StatusEnum, {
        invalid_type_error: "Please enter a valid Status: Active (1), Inactive (0).",
    }),
    // If StatusEnum fails, try BlogStatus
    zod_1.z.nativeEnum(enums_1.BlogStatus, {
        invalid_type_error: "Please enter a valid Status: Draft (0), Published (1), Pending (2).",
    }),
    // If both enums fail, try string transformation for numeric strings
    zod_1.z
        .string()
        .transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed))
            return val; // Return original if not a number
        // Try to match with StatusEnum
        if (Object.values(admin_enums_1.StatusEnum).includes(parsed)) {
            return parsed;
        }
        // Try to match with BlogStatus
        if (Object.values(enums_1.BlogStatus).includes(parsed)) {
            return parsed;
        }
        return val; // Return original if no match (will fail validation)
    })
        .pipe(zod_1.z.union([zod_1.z.nativeEnum(admin_enums_1.StatusEnum), zod_1.z.nativeEnum(enums_1.BlogStatus)])),
])
    .optional()
    .nullable();
exports.mongooseIdValidationSchema = zod_1.z
    .string({ required_error: "Role Id is required to Create a new Admin." })
    .length(24, "Invalid Id length.")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format.");
exports.IdSchemaUpdate = zod_1.z.object({
    id: zod_1.z
        .string({ required_error: "Id is required to perform update action." })
        .length(24, "Invalid Id length.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
});
exports.IdSchemaDelete = zod_1.z.object({
    id: zod_1.z
        .string({ required_error: "Id is required to perform delete action." })
        .length(24, "Invalid Id length.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
});
exports.IdSchemaGet = zod_1.z.object({
    id: zod_1.z
        .string({ required_error: "Id is required to perform get action." })
        .length(24, "Invalid Id length.")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
});
exports.PageListQuerySchema = zod_1.z.object({
    page: exports.pageQuerySchema,
    pageSize: exports.pageSizeQuerySchema,
    search: exports.searchQuerySchema,
    status: exports.statusQuerySchema,
});
