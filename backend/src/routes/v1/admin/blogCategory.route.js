"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const blogCategory_controller_1 = require("../../../controllers/v1/admin/blogCategory.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const blogCategory_schema_1 = require("../../../schemas/admin/blogCategory.schema");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const BlogCategoryRoute = express_1.default.Router();
// Get all blog categories data for blog category management
BlogCategoryRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_CATEGORY, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: common_schema_1.PageListQuerySchema }), blogCategory_controller_1.GetBlogCategories);
// Get blog category list for dropdown
BlogCategoryRoute.get("/list", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_CATEGORY, permissions_constants_1.PermissionType.VIEW), blogCategory_controller_1.GetBlogCategoryList);
// Create new blog category
BlogCategoryRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_CATEGORY, permissions_constants_1.PermissionType.CREATE), (0, validation_utils_1.validateData)({ body: blogCategory_schema_1.CreateBlogCategorySchema }), blogCategory_controller_1.CreateBlogCategory);
// Get the blog category details by id
BlogCategoryRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_CATEGORY, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), blogCategory_controller_1.GetBlogCategoryById);
// Update the role
BlogCategoryRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_CATEGORY, permissions_constants_1.PermissionType.EDIT), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), (0, validation_utils_1.validateData)({ body: blogCategory_schema_1.UpdateBlogCategorySchema }), blogCategory_controller_1.UpdateBlogCategory);
// Delete the role
BlogCategoryRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_CATEGORY, permissions_constants_1.PermissionType.DELETE), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaDelete }), blogCategory_controller_1.DeleteBlogCategory);
exports.default = BlogCategoryRoute;
