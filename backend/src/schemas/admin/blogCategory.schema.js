"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogCategorySchema = exports.CreateBlogCategorySchema = void 0;
const zod_1 = require("zod");
const admin_enums_1 = require("../../constants/admin.enums");
// Base schema with common fields
const blogCategoryBaseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(100),
    status: zod_1.z.nativeEnum(admin_enums_1.StatusEnum).optional(),
    slug: zod_1.z
        .string({ required_error: "Slug is required to create Category" })
        .min(3, "Slug must be at least 3 characters")
        .max(60, "Category name cannot be greater than 50 characters")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (use lowercase letters, numbers and hyphens)"),
});
// Create schema (requires name, generates slug)
exports.CreateBlogCategorySchema = blogCategoryBaseSchema.extend({
    name: zod_1.z
        .string({ required_error: "Category name is required" })
        .min(5, "Category name must be at least 3 characters")
        .max(50, "Category name cannot be greater than 50 characters"),
});
// Update schema (all fields optional except for validation)
exports.UpdateBlogCategorySchema = exports.CreateBlogCategorySchema.partial().optional();
