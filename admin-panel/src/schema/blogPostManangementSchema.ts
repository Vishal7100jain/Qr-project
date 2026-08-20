import { BlogPostStatus, BlogType, RoleEnum } from "@/enums/adminEnums";
import * as yup from "yup";

const numericEnum = (e: object) =>
  Object.values(e).filter((v) => typeof v === "number") as number[];

/* -------------------- CREATE -------------------- */
export const CreateBlogPostSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 10 characters")
    .max(100, "Title must not exceed 200 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be 10 characters long")
    .max(200, "Description cannot exceed 200 characters"),

  slug: yup
    .string()
    .required("Slug is required")
    .min(15, "Slug must be at least 10 characters")
    .max(210, "Slug name cannot be greater than 210 characters"),

  content: yup
    .string()
    .required("Content is required")
    .min(1000, "Content must be 1000 characters long")
    .max(20000, "Content cannot exceed 20,000 characters"),

  tags: yup
    .array()
    .transform((cur, orig) =>
      Array.isArray(orig)
        ? orig.filter((t) => t && String(t).trim() !== "")
        : cur
    )
    .of(yup.string().required("Tag cannot be empty"))
    .optional(),

  status: yup
    .string()
    .oneOf(numericEnum(BlogPostStatus).map(String), "Invalid status")
    .required(),

  type: yup
    .string()
    .oneOf(numericEnum(BlogType).map(String), "Invalid type")
    .required(),

  createdByRole: yup
    .string()
    .oneOf(numericEnum(RoleEnum).map(String), "Invalid role")
    .required(),

  categoryId: yup.string().required("Category is required"),

  thumbnail: yup
    .mixed<File | string>()
    .required("Thumbnail is required")
    .test("fileSize", "File too large (max 1MB)", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
});

/* -------------------- UPDATE -------------------- */
export const UpdateBlogPostSchema = yup.object().shape({
  title: yup
    .string()
    .optional()
    .min(3, "Title must be at least 10 characters")
    .max(100, "Title must not exceed 200 characters"),

  description: yup
    .string()
    .optional()
    .min(10, "Description must be 10 characters long")
    .max(200, "Description cannot exceed 200 characters"),

  slug: yup
    .string()
    .optional()
    .min(15, "Slug must be at least 10 characters")
    .max(210, "Slug name cannot be greater than 210 characters"),

  content: yup
    .string()
    .optional()
    .min(1000, "Content must be 1000 characters long")
    .max(20000, "Content cannot exceed 20,000 characters"),
  tags: yup
    .array()
    .transform((cur, orig) =>
      Array.isArray(orig)
        ? orig.filter((t) => t && String(t).trim() !== "")
        : cur
    )
    .of(yup.string())
    .optional(),

  status: yup
    .string()
    .oneOf(numericEnum(BlogPostStatus).map(String), "Invalid status")
    .optional(),

  type: yup
    .string()
    .oneOf(numericEnum(BlogType).map(String), "Invalid type")
    .optional(),

  createdByRole: yup
    .string()
    .oneOf(numericEnum(RoleEnum).map(String), "Invalid role")
    .optional(),

  categoryId: yup.string().optional(),

  thumbnail: yup
    .mixed<File | string>()
    .optional()
    .test("fileSize", "File too large (max 1MB)", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
});
