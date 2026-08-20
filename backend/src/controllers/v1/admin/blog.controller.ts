import { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { DeletedEnum, StatusEnum } from "../../../constants/admin.enums";
import { BlogType, RoleEnum } from "../../../constants/enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import Blog from "../../../models/admin/blog.model";
import BlogCategory from "../../../models/admin/blogCategory.model";
import { deleteFile } from "../../../multer/deleteFile";

// Create New Blog
export const CreateBlog = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_POST;

  try {
    const {
      title,
      description,
      slug,
      content,
      categoryId,
      tags,
      status,
      type,
    } = req.body;

    const adminId = req?.admin?._id;
    const isSluginUse = await Blog.exists({ slug });
    if (isSluginUse) {
      deleteFile(req.file?.path);
      return sendError(req, res, "Title or slug is already in use", 400);
    }

    // checking blog category exists
    const isCategoryExist = await BlogCategory.findOne(
      { _id: categoryId, status: StatusEnum.ACTIVE },
      "_id"
    ).lean();

    if (!isCategoryExist) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.blog.categoryNotFound,
        400
      );
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      description,
      slug,
      content,
      categoryId,
      tags,
      type,
      approvedBy:
        type == BlogType.isFeatured || type == BlogType.isLatest
          ? adminId
          : null,
      status,
      createdByRole: RoleEnum.ADMIN,
      createdBy: adminId,
      createdByModel: "Admin", // Set the model type
      modifiedBy: adminId,
      modifiedByModel: "Admin", // Set the model type
    });

    if (req.file?.filename) {
      const fileName = req.file?.filename;
      newBlog.thumbnail = `/blogs/${fileName}`;
    }

    const savedBlog = await newBlog.save();
    if (!savedBlog) {
      deleteFile(req.file?.path);
      sendError(req, res, CommonErrorMessage?.admin.blog.failedCreation, 400);
    }

    sendSuccess(
      req,
      res,
      savedBlog,
      CommonSuccessMessage.admin.blog.blogCreated,
      201
    );
  } catch (error: any) {
    deleteFile(req.file?.path);
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage?.admin.blog.failedCreation,
      500,
      error
    );
  }
};

// Get Blogs for list table
export const GetBlogs = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_POST;

  try {
    const { page = 1, pageSize = 10, status, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== undefined && status !== null) {
      filter.status = { $eq: Number(status) };
    }

    const result = await Blog.aggregate([
      { $match: { ...filter, isDeleted: DeletedEnum.NOT_DELETED } },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
            // Dynamic lookup for createdBy based on model type
            {
              $lookup: {
                from: "admins",
                let: {
                  createdById: "$createdBy",
                  modelType: "$createdByModel",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$_id", "$$createdById"] },
                          { $eq: ["$$modelType", "Admin"] },
                        ],
                      },
                    },
                  },
                  { $project: { email: 1 } },
                ],
                as: "creatorAdmin",
              },
            },
            {
              $lookup: {
                from: "artists",
                let: {
                  createdById: "$createdBy",
                  modelType: "$createdByModel",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$_id", "$$createdById"] },
                          { $eq: ["$$modelType", "Artist"] },
                        ],
                      },
                    },
                  },
                  { $project: { email: 1 } },
                ],
                as: "creatorArtist",
              },
            },
            // Dynamic lookup for modifiedBy based on model type
            {
              $lookup: {
                from: "admins",
                let: {
                  modifiedById: "$modifiedBy",
                  modelType: "$modifiedByModel",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$_id", "$$modifiedById"] },
                          { $eq: ["$$modelType", "Admin"] },
                        ],
                      },
                    },
                  },
                  { $project: { email: 1 } },
                ],
                as: "updatorAdmin",
              },
            },
            {
              $lookup: {
                from: "artists",
                let: {
                  modifiedById: "$modifiedBy",
                  modelType: "$modifiedByModel",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$_id", "$$modifiedById"] },
                          { $eq: ["$$modelType", "Artist"] },
                        ],
                      },
                    },
                  },
                  { $project: { email: 1 } },
                ],
                as: "updatorArtist",
              },
            },
            {
              $lookup: {
                from: "admins",
                localField: "approvedBy",
                foreignField: "_id",
                as: "approver",
              },
            },
            {
              $unwind: {
                path: "$approver",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "blogcategories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                // Combine creator fields
                creator: {
                  $cond: {
                    if: { $gt: [{ $size: "$creatorAdmin" }, 0] },
                    then: { $arrayElemAt: ["$creatorAdmin", 0] },
                    else: { $arrayElemAt: ["$creatorArtist", 0] },
                  },
                },
                // Combine updator fields
                updator: {
                  $cond: {
                    if: { $gt: [{ $size: "$updatorAdmin" }, 0] },
                    then: { $arrayElemAt: ["$updatorAdmin", 0] },
                    else: { $arrayElemAt: ["$updatorArtist", 0] },
                  },
                },
              },
            },
            {
              $project: {
                title: 1,
                slug: 1,
                content: 1,
                description: 1,
                tags: 1,
                status: 1,
                type: 1,
                thumbnail: 1,
                views: 1,
                likes: 1,
                comments: 1,
                contentLength: 1,
                hasImage: 1,
                createdByRole: 1,
                categorySlug: "$category.slug",
                approvedBy: "$approver.email",
                createdBy: "$creator.email",
                modifiedBy: "$updator.email",
                createdAt: 1,
                updatedAt: 1,
                createdByModel: 1,
                modifiedByModel: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const blogs = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: blogs,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.blog.blogRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.blog.failedFetch,
      500,
      error
    );
  }
};

// Get the Blog by Id
export const GetBlogById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_POST;

  try {
    const { id } = req.params;
    const result = await Blog.findById(id)
      .populate([
        { path: "categoryId", select: "slug" },
        { path: "approvedBy", select: "email" },
        // Use the virtual fields for population
      ])
      .lean();

    if (!result) {
      return sendError(req, res, CommonErrorMessage.admin.blog.notFound, 400);
    }

    // Manually populate createdBy and modifiedBy based on model type
    let creator: any;
    let updator: any;

    if (result.createdByModel === "Admin") {
      const Admin = mongoose.model("Admin");
      creator = await Admin.findById(result.createdBy).select("email").lean();
    } else if (result.createdByModel === "Artist") {
      const Artist = mongoose.model("Artist");
      creator = await Artist.findById(result.createdBy).select("email").lean();
    }

    if (result.modifiedByModel === "Admin") {
      const Admin = mongoose.model("Admin");
      updator = await Admin.findById(result.modifiedBy).select("email").lean();
    } else if (result.modifiedByModel === "Artist") {
      const Artist = mongoose.model("Artist");
      updator = await Artist.findById(result.modifiedBy).select("email").lean();
    }

    const populatedResult = {
      ...result,
      createdBy: creator ? creator.email : "Unknown",
      modifiedBy: updator ? updator.email : "Unknown",
    };

    sendSuccess(
      req,
      res,
      populatedResult,
      CommonSuccessMessage.admin.blog.blogRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.blog.failedFetch,
      500,
      error
    );
  }
};

// Update blog by id
export const UpdateBlog = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_POST;
  try {
    const hasBodyData =
      req.body &&
      Object.values(req.body).some(
        (value) => value !== undefined && value !== null && value !== ""
      );
    const hasFileData = req.file && req.file.filename;

    if (!hasBodyData && !hasFileData) {
      deleteFile(req.file?.path);
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.oneFieldRequired,
        400
      );
    }

    const { id } = req.params;
    const adminId = req.admin?._id;
    const { slug } = req.body;

    const isSluginUse = await Blog.exists({ slug, _id: { $ne: id } });
    if (isSluginUse) {
      deleteFile(req.file?.path);
      return sendError(req, res, "Title or slug is already in use", 400);
    }

    const BlogToUpdate = await Blog.findOne({
      _id: id,
      isDeleted: DeletedEnum.NOT_DELETED,
    }).lean();

    if (!BlogToUpdate) {
      return sendError(req, res, CommonErrorMessage.admin.blog.notFound, 400);
    }

    const updatedValue: any = {};
    Object.entries(req.body).map(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        updatedValue[key] = value;
      }
    });

    // checking blog category exists if new category id is assign
    if (updatedValue?.categoryId) {
      const isCategoryExist = await BlogCategory.findOne(
        { _id: updatedValue?.categoryId, status: StatusEnum.ACTIVE },
        "_id"
      ).lean();

      if (!isCategoryExist) {
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.blog.categoryNotFound,
          400
        );
      }
    } else {
      // checking the existing blog category is correctly exists or not
      const isCategoryExist = await BlogCategory.findOne(
        { _id: BlogToUpdate?.categoryId, status: StatusEnum.ACTIVE },
        "_id"
      ).lean();

      if (!isCategoryExist) {
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.blog.categoryNotFound +
            ", change the category pastly assigned to this blog",
          400
        );
      }
    }

    // updating the approval admin
    if (
      updatedValue?.type != BlogType.normal &&
      BlogToUpdate.type == BlogType.normal
    ) {
      updatedValue.approvedBy = adminId;
    }

    // deleting the old image
    if (req.file?.filename) {
      const fullPath = path.join(
        process.cwd(),
        "public",
        String(BlogToUpdate?.thumbnail)
      );
      deleteFile(fullPath);
      const fileName = req.file?.filename;
      updatedValue.thumbnail = `/blogs/${fileName}`;
    }

    // updating blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        modifiedBy: adminId,
        modifiedByModel: "Admin", // Always set to Admin for admin updates
        ...updatedValue,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.blog.failedUpdate,
        404
      );
    }

    sendSuccess(
      req,
      res,
      updatedBlog,
      CommonSuccessMessage.admin.blog.blogUpdatedSuccess
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.blog.failedUpdate,
      500,
      error
    );
  }
};

// Delete Blog by Id
export const DeleteBlog = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_POST;

  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id }, "_id");
    if (!blog) {
      return sendError(req, res, CommonErrorMessage.admin.blog.notFound, 400);
    }

    const deletedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: { isDeleted: DeletedEnum.DELETED },
      },
      { new: true }
    );

    return sendSuccess(
      req,
      res,
      deletedBlog,
      CommonSuccessMessage.admin.blog.blogDeleteSuccess
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      CommonErrorMessage.admin.blog.failedDelete,
      500,
      error
    );
  }
};
