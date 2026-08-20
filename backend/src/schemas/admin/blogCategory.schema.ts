import { z } from "zod";
import { StatusEnum } from "../../constants/admin.enums";

// Base schema with common fields
const blogCategoryBaseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  status: z.nativeEnum(StatusEnum).optional(),
  slug: z
    .string({ required_error: "Slug is required to create Category" })
    .min(3, "Slug must be at least 3 characters")
    .max(60, "Category name cannot be greater than 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Invalid slug format (use lowercase letters, numbers and hyphens)"
    ),
});

// Create schema (requires name, generates slug)
export const CreateBlogCategorySchema = blogCategoryBaseSchema.extend({
  name: z
    .string({ required_error: "Category name is required" })
    .min(5, "Category name must be at least 3 characters")
    .max(50, "Category name cannot be greater than 50 characters"),
});

// Update schema (all fields optional except for validation)
export const UpdateBlogCategorySchema = CreateBlogCategorySchema.partial().optional();
