import { z } from "zod";
import { BlogStatus, BlogType } from "../../constants/enums";

/**
 * Schema for creating a new blog post.
 * Includes validation rules and descriptive field documentation.
 */
export const createBlogSchema = z.object({
  // Blog title (Required)
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Invalid Title",
    })
    .min(10, "Title must be 10 characters long")
    .max(200, "Title cannot exceed 200 characters")
    .describe("Title of the blog post (1–200 characters)"),

  // Blog description (Required)
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Invalid Description",
    })
    .min(10, "Description must be 10 characters long")
    .max(200, "Description cannot exceed 200 characters")
    .describe("Description of the blog post (1–200 characters)"),

  // Blog slug (Required, used for SEO-friendly URLs)
  slug: z
    .string({
      required_error: "Slug is required to create Blog",
      invalid_type_error: "Invalid Slug",
    })
    .min(15, "Slug must be at least 10 characters")
    .max(210, "Slug name cannot be greater than 210 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Invalid slug format (use lowercase letters, numbers and hyphens)"
    ),

  // Main content body (Required)
  content: z
    .string({
      required_error: "Content is required",
      invalid_type_error: "Invalid Content",
    })
    .min(1000, "Content must be 1000 characters long")
    .max(20000, "Content cannot exceed 20,000 characters")
    .describe("Main HTML or markdown content of the blog"),

  // Optional category
  categoryId: z
    .string({
      required_error: "Category Id is required to create blog.",
      invalid_type_error: "Invalid Category Id",
    })
    .length(24, "Invalid Id length.")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format."),
  tags: z
    .union([
      z.string().transform((val) => val.split(",").map((t) => t.trim())),
      z.array(z.string()),
    ])
    .optional()
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .refine((arr) => arr.length <= 3, {
      message: "you can only add upto 3 tags",
    }),
  // Optional — Blog status (defaults to Draft)
  status: z
    .union([
      z.nativeEnum(BlogStatus),
      z.string().transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) return val; // Fallback (will fail nativeEnum check)
        return parsed as BlogStatus; // Convert to number (enum)
      }),
    ])
    .pipe(
      z.nativeEnum(BlogStatus, {
        invalid_type_error:
          "Please enter a valid Status: DRAFT (0), PUBLISHED (1), or PENDING (2).",
      })
    )
    .default(BlogStatus.DRAFT),

  // Optional — Blog type (defaults to normal)
  type: z
    .union([
      z.nativeEnum(BlogType),
      z.string().transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) return val; // Fallback (will fail nativeEnum check)
        return parsed as BlogType; // Convert to number (enum)
      }),
    ])
    .pipe(
      z.nativeEnum(BlogType, {
        invalid_type_error:
          "Please enter a valid Status: isFeatured (0), isLatest (1), or normal (2).",
      })
    )
    .default(BlogType.normal),
});

/**
 * Schema for updating a blog post.
 * Includes validation rules and descriptive field documentation.
 */
export const UpdateBlogSchema = z
  .object({
    title: z
      .string({
        invalid_type_error: "Invalid Title",
      })
      .min(10, "Title must be 10 characters long")
      .max(200, "Title cannot exceed 200 characters")
      .describe("Title of the blog post (1–200 characters)")
      .optional(),
    // Blog description
    description: z
      .string({
        invalid_type_error: "Invalid Description",
      })
      .min(10, "Description must be 10 characters long")
      .max(200, "Description cannot exceed 200 characters")
      .describe("Description of the blog post (1–200 characters)")
      .optional(),

    // Blog slug (Required, used for SEO-friendly URLs)
    slug: z
      .string({
        invalid_type_error: "Invalid Slug",
      })
      .min(15, "Slug must be at least 10 characters")
      .max(210, "Slug name cannot be greater than 210 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Invalid slug format (use lowercase letters, numbers and hyphens)"
      )
      .optional(),

    // Main content body (Required)
    content: z
      .string({
        invalid_type_error: "Invalid Content",
      })
      .min(1000, "Content must be 1000 characters long")
      .max(20000, "Content cannot exceed 20,000 characters")
      .describe("Main HTML or markdown content of the blog")
      .optional(),

    // Optional category
    categoryId: z
      .string({
        invalid_type_error: "Invalid Category Id",
      })
      .length(24, "Invalid Id length.")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format.")
      .optional(),

    tags: z
      .union([
        z.string().transform((val) => val.split(",").map((t) => t.trim())),
        z.array(z.string()),
      ])
      .optional()
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .refine((arr) => arr.length <= 3, {
        message: "you can only add upto 3 tags",
      }),
    // Optional — Blog status (defaults to Draft)
    status: z
      .union([
        z.nativeEnum(BlogStatus),
        z.string().transform((val) => {
          const parsed = parseInt(val, 10);
          if (isNaN(parsed)) return val; // Fallback (will fail nativeEnum check)
          return parsed as BlogStatus; // Convert to number (enum)
        }),
      ])
      .pipe(
        z.nativeEnum(BlogStatus, {
          invalid_type_error:
            "Please enter a valid Status: DRAFT (0), PUBLISHED (1), or PENDING (2).",
        })
      )
      .optional(),

    // Optional — Blog type (defaults to normal)
    type: z
      .union([
        z.nativeEnum(BlogType),
        z.string().transform((val) => {
          const parsed = parseInt(val, 10);
          if (isNaN(parsed)) return val; // Fallback (will fail nativeEnum check)
          return parsed as BlogType; // Convert to number (enum)
        }),
      ])
      .pipe(
        z.nativeEnum(BlogType, {
          invalid_type_error:
            "Please enter a valid Status: isFeatured (0), isLatest (1), or normal (2).",
        })
      )
      .optional(),
  })
  .optional();
