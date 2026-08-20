"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const blog_controller_1 = require("../../../controllers/v1/admin/blog.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const blog_multer_1 = __importDefault(require("../../../multer/blog.multer"));
const blog_schema_1 = require("../../../schemas/admin/blog.schema");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const BlogRoute = express_1.default.Router();
// Get all blogs data for blog category management
BlogRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_POST, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: common_schema_1.PageListQuerySchema }), blog_controller_1.GetBlogs);
// Create new blog
BlogRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_POST, permissions_constants_1.PermissionType.CREATE), blog_multer_1.default.single("thumbnail"), (0, validation_utils_1.validateData)({ body: blog_schema_1.createBlogSchema }), blog_controller_1.CreateBlog);
// Get the blog details by id
BlogRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_POST, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), blog_controller_1.GetBlogById);
// Update Blog by Id
BlogRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_POST, permissions_constants_1.PermissionType.EDIT), blog_multer_1.default.single("thumbnail"), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), (0, validation_utils_1.validateData)({ body: blog_schema_1.UpdateBlogSchema }), blog_controller_1.UpdateBlog);
// Delete the Blog by Id
BlogRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.BLOG_POST, permissions_constants_1.PermissionType.DELETE), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaDelete }), blog_controller_1.DeleteBlog);
exports.default = BlogRoute;
