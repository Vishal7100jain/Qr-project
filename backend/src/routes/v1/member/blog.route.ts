import express from "express";
import {
  GetBlogById,
  GetBlogCategoryList,
  GetFilteredBlogs,
} from "../../../controllers/v1/member/blog.controller";
import { IdSchemaGet } from "../../../schemas/admin/common.schema";
import { BlogFiltereTypeEnum } from "../../../schemas/member/memberBlog.schema";
import { validateData } from "../../../utils/validation.utils";

const MemberBlogRoute = express.Router();

// Get Blogs list by type
MemberBlogRoute.get(
  "/",
  validateData({ query: BlogFiltereTypeEnum }),
  GetFilteredBlogs
);

// Get category list with top most blogs related to it
MemberBlogRoute.get("/category-list", GetBlogCategoryList);

// Get blog by id to read more about it
MemberBlogRoute.get("/:id", validateData({ params: IdSchemaGet }), GetBlogById);

export default MemberBlogRoute;
