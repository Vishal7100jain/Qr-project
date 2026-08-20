import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  CreateBlog,
  DeleteBlog,
  GetBlogById,
  GetBlogs,
  UpdateBlog,
} from "../../../controllers/v1/admin/blog.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import BlogImageUpload from "../../../multer/blog.multer";
import {
  createBlogSchema,
  UpdateBlogSchema,
} from "../../../schemas/admin/blog.schema";
import {
  IdSchemaDelete,
  IdSchemaGet,
  IdSchemaUpdate,
  PageListQuerySchema,
} from "../../../schemas/admin/common.schema";
import { validateData } from "../../../utils/validation.utils";

const BlogRoute = express.Router();

// Get all blogs data for blog category management
BlogRoute.get(
  "/",
  checkModulePermission(ModuleName.BLOG_POST, PermissionType.VIEW),
  validateData({ query: PageListQuerySchema }),
  GetBlogs
);

// Create new blog
BlogRoute.post(
  "/",
  checkModulePermission(ModuleName.BLOG_POST, PermissionType.CREATE),
  BlogImageUpload.single("thumbnail"),
  validateData({ body: createBlogSchema }),
  CreateBlog
);

// Get the blog details by id
BlogRoute.get(
  "/:id",
  checkModulePermission(ModuleName.BLOG_POST, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetBlogById
);

// Update Blog by Id
BlogRoute.put(
  "/:id",
  checkModulePermission(ModuleName.BLOG_POST, PermissionType.EDIT),
  BlogImageUpload.single("thumbnail"),
  validateData({ params: IdSchemaUpdate }),
  validateData({ body: UpdateBlogSchema }),
  UpdateBlog
);

// Delete the Blog by Id
BlogRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.BLOG_POST, PermissionType.DELETE),
  validateData({ params: IdSchemaDelete }),
  DeleteBlog
);

export default BlogRoute;
