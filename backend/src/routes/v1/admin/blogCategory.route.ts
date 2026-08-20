import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  CreateBlogCategory,
  DeleteBlogCategory,
  GetBlogCategories,
  GetBlogCategoryById,
  GetBlogCategoryList,
  UpdateBlogCategory,
} from "../../../controllers/v1/admin/blogCategory.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import {
  CreateBlogCategorySchema,
  UpdateBlogCategorySchema,
} from "../../../schemas/admin/blogCategory.schema";
import {
  IdSchemaDelete,
  IdSchemaGet,
  IdSchemaUpdate,
  PageListQuerySchema,
} from "../../../schemas/admin/common.schema";
import { validateData } from "../../../utils/validation.utils";

const BlogCategoryRoute = express.Router();

// Get all blog categories data for blog category management
BlogCategoryRoute.get(
  "/",
  checkModulePermission(ModuleName.BLOG_CATEGORY, PermissionType.VIEW),
  validateData({ query: PageListQuerySchema }),
  GetBlogCategories
);

// Get blog category list for dropdown
BlogCategoryRoute.get(
  "/list",
  checkModulePermission(ModuleName.BLOG_CATEGORY, PermissionType.VIEW),
  GetBlogCategoryList
);

// Create new blog category
BlogCategoryRoute.post(
  "/",
  checkModulePermission(ModuleName.BLOG_CATEGORY, PermissionType.CREATE),
  validateData({ body: CreateBlogCategorySchema }),
  CreateBlogCategory
);

// Get the blog category details by id
BlogCategoryRoute.get(
  "/:id",
  checkModulePermission(ModuleName.BLOG_CATEGORY, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetBlogCategoryById
);

// Update the role
BlogCategoryRoute.put(
  "/:id",
  checkModulePermission(ModuleName.BLOG_CATEGORY, PermissionType.EDIT),
  validateData({ params: IdSchemaUpdate }),
  validateData({ body: UpdateBlogCategorySchema }),
  UpdateBlogCategory
);

// Delete the role
BlogCategoryRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.BLOG_CATEGORY, PermissionType.DELETE),
  validateData({ params: IdSchemaDelete }),
  DeleteBlogCategory
);

export default BlogCategoryRoute;
