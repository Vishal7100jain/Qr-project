"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsMongosId = exports.UpdateRoleSchema = exports.CreateRoleSchema = exports.GetRoleQuerySchema = void 0;
const zod_1 = require("zod");
const permissions_constants_1 = require("../../constants/permissions.constants");
const common_schema_1 = require("./common.schema");
exports.GetRoleQuerySchema = zod_1.z.object({
    page: common_schema_1.pageQuerySchema,
    pageSize: common_schema_1.pageSizeQuerySchema,
    search: common_schema_1.searchQuerySchema,
});
const PermissionSchema = zod_1.z.object({
    module: zod_1.z
        .string({
        required_error: "Module is required",
        invalid_type_error: "Please enter a valid Module Name",
    })
        .min(1, "Module name cannot be empty")
        .trim(),
    permissions: zod_1.z.array(zod_1.z.nativeEnum(permissions_constants_1.PermissionType), {
        required_error: "Permission is required",
        invalid_type_error: "Invalid Permission",
    }),
});
exports.CreateRoleSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Role name is required" })
        .min(3, "Role name must be at least 3 characters")
        .max(50, "Role name must not excced 50 characters"),
    description: zod_1.z.string().optional(),
    access: zod_1.z
        .array(PermissionSchema, {
        required_error: "Permission is requried",
        invalid_type_error: "Please enter valid Access",
    })
        .min(1, "At least one permission is required"),
});
exports.UpdateRoleSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().optional(),
    access: zod_1.z.array(PermissionSchema).optional(),
})
    .partial()
    .refine((data) => data.access || (data === null || data === void 0 ? void 0 : data.description) || (data === null || data === void 0 ? void 0 : data.name), {
    message: "At least one of name, description, or access is required to update the role",
    path: ["name", "description", "access"],
});
exports.ParamsMongosId = zod_1.z.object({
    id: zod_1.z
        .string({ required_error: "Id is required to Update Role" })
        .length(24, "Invalid Id length")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format"),
});
