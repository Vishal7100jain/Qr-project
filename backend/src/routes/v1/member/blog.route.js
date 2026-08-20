"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("../../../controllers/v1/member/blog.controller");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const memberBlog_schema_1 = require("../../../schemas/member/memberBlog.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const MemberBlogRoute = express_1.default.Router();
// Get Blogs list by type
MemberBlogRoute.get("/", (0, validation_utils_1.validateData)({ query: memberBlog_schema_1.BlogFiltereTypeEnum }), blog_controller_1.GetFilteredBlogs);
// Get category list with top most blogs related to it
MemberBlogRoute.get("/category-list", blog_controller_1.GetBlogCategoryList);
// Get blog by id to read more about it
MemberBlogRoute.get("/:id", (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), blog_controller_1.GetBlogById);
exports.default = MemberBlogRoute;
