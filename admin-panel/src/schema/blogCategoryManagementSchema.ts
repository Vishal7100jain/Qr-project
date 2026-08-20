import { BlogStatus } from "@/enums/adminEnums";
import * as yup from "yup";

export const CreateBlogCategorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Title is required.")
    .min(3, "Title must be at least 3 characters long.")
    .max(30, "Title must not exceed 30 characters."),

  slug: yup
    .string()
    .required("Slug is required.")
    .min(3, "Slug must be at least 3 characters long.")
    .max(30, "Slug must not exceed 30 characters."),

  status: yup
    .mixed<BlogStatus>()
    .oneOf(Object.values(BlogStatus as any), {
      message:
        "Please enter a valid Status: Active (1), Inactive (0) or Suspended (2)",
    })
    .required("Status is required"),
});

export const UpdateBlogCategorySchema = yup.object().shape({
  name: yup
    .string()
    .required("Title is required.")
    .min(3, "Title must be at least 3 characters long.")
    .max(30, "Title must not exceed 30 characters."),

  slug: yup
    .string()
    .required("Slug is required.")
    .min(3, "Slug must be at least 3 characters long.")
    .max(30, "Slug must not exceed 30 characters."),

  status: yup
    .mixed<BlogStatus>()
    .oneOf(Object.values(BlogStatus as any), {
      message:
        "Please enter a valid Status: Active (1), Inactive (0) or Suspended (2)",
    })
    .required("Status is required"),
});
