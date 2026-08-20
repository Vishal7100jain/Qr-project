import { Request, Response } from "express";
import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { DeletedEnum, StatusEnum } from "../../../constants/admin.enums";
import { BlogStatus } from "../../../constants/enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import Blog from "../../../models/admin/blog.model";
import BlogCategory from "../../../models/admin/blogCategory.model";

// Function to batch populate createdBy for multiple blogs
const batchPopulateCreatedBy = async (blogs: any[]) => {
  const adminIds: any = [];
  const artistIds: any = [];
  const blogMap = new Map();

  // Separate blogs by creator type and map them
  blogs.forEach((blog, index) => {
    blogMap.set(index, blog);
    if (blog.createdByModel === "Admin") {
      adminIds.push(blog.createdBy);
    } else if (blog.createdByModel === "Artist") {
      artistIds.push(blog.createdBy);
    }
  });

  // Batch fetch admins and artists
  const Admin = mongoose.model("Admin");
  // const Artist = mongoose.model("Artist");

  const [admins] = await Promise.all([
    adminIds.length > 0
      ? Admin.find({ _id: { $in: adminIds } })
          .select("username profileImage _id")
          .lean()
      : [],
    // artistIds.length > 0
    //   ? Artist.find({ _id: { $in: artistIds } })
    //       .select("email")
    //       .lean()
    //   : [],
  ]);

  // Create lookup maps
  const adminMap = new Map(
    admins.map((admin: any) => [admin?._id.toString(), admin])
  );
  // const artistMap = new Map(
  //   artists.map((artist: any) => [artist?._id.toString(), artist])
  // );

  // Assign createdBy to blogs
  return blogs.map((blog, index) => {
    const originalBlog = blogMap.get(index);
    if (blog.createdByModel === "Admin") {
      return {
        ...originalBlog,
        createdBy: adminMap.get(blog.createdBy.toString()) || "Unknown",
      };
    } else if (blog.createdByModel === "Artist") {
      // return {
      //   ...originalBlog,
      //   createdBy: artistMap.get(blog.createdBy.toString()) || "Unknown",
      // };
    }
    return { ...originalBlog, createdBy: "Unknown" };
  });
};

// Get Filtered Blogs
export const GetFilteredBlogs = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const filter: any = {
      isDeleted: DeletedEnum.NOT_DELETED,
      status: BlogStatus.PUBLISHED,
    };

    if (type) {
      filter.type = Number(type);
    }

    const filteredBlogs = await Blog.aggregate([
      {
        $match: { ...filter },
      },
      {
        $lookup: {
          from: "admins",
          let: { createdById: "$createdBy", modelType: "$createdByModel" },
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
            { $project: { username: 1, email: 1, profileImage: 1 } },
          ],
          as: "creatorAdmin",
        },
      },
      {
        $lookup: {
          from: "artists",
          let: { createdById: "$createdBy", modelType: "$createdByModel" },
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
            { $project: { name: 1, email: 1 } },
          ],
          as: "creatorArtist",
        },
      },
      {
        $lookup: {
          from: "blogcategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
          pipeline: [{ $project: { _id: 1, slug: 1, name: 1 } }],
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
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
        },
      },
      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          content: 1,
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
          category: "$category",
          createdBy: "$creator",
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return sendSuccess(
      req,
      res,
      filteredBlogs,
      CommonSuccessMessage.admin.blog.blogRetrieved
    );
  } catch (error: any) {
    return sendError(
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
  try {
    const { id } = req.params;
    const result = await Blog.findById(
      id,
      "_id title categoryId slug content description tags status type views likes contentLength hasImage createdByModel createdBy"
    )
      .populate([{ path: "categoryId", select: "slug name" }])
      .lean();

    if (!result) {
      return sendError(req, res, CommonErrorMessage.admin.blog.notFound, 400);
    }

    // Manually populate createdBy and modifiedBy for the main blog
    let creator: any;

    if (result.createdByModel === "Admin") {
      const Admin = mongoose.model("Admin");
      creator = await Admin.findById(result.createdBy)
        .select("username profileImage _id")
        .lean();
    } else if (result.createdByModel === "Artist") {
      // const Artist = mongoose.model("Artist");
      // creator = await Artist.findById(result.createdBy).select("email").lean();
    }

    // Fetch related blogs by same category (excluding current blog)
    const categoryBlogsRaw = await Blog.find({
      categoryId: result.categoryId,
      _id: { $ne: id },
    })
      .select(
        "title slug excerpt featuredImage createdAt createdBy createdByModel"
      )
      .limit(5)
      .lean();

    // Fetch related blogs by same tags (excluding current blog)
    let tagsBlogsRaw: any = [];
    if (result.tags && result.tags.length > 0) {
      tagsBlogsRaw = await Blog.find({
        tags: { $in: result.tags },
        _id: { $ne: id },
      })
        .select(
          "title slug excerpt featuredImage createdAt createdBy createdByModel"
        )
        .limit(5)
        .lean();
    }

    // Use Promise.all to populate categoryBlogs and tagsBlogs in parallel
    const [categoryBlogs, tagsBlogs] = await Promise.all([
      categoryBlogsRaw.length > 0
        ? batchPopulateCreatedBy(categoryBlogsRaw)
        : [],
      tagsBlogsRaw.length > 0 ? batchPopulateCreatedBy(tagsBlogsRaw) : [],
    ]);

    const populatedResult = {
      ...result,
      createdBy: creator ? creator : "Unknown",
      categoryBlogs, // Array of blogs with same category (including createdBy)
      tagsBlogs: tagsBlogs || [], // Array of blogs with similar tags (including createdBy)
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

// Get the list of Blog categories with the most published blogs
export const GetBlogCategoryList = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await BlogCategory.aggregate([
      // Match only active categories
      { $match: { status: StatusEnum.ACTIVE } },

      // Lookup to join with blogs
      {
        $lookup: {
          from: "blogs", // Collection name (usually pluralized lowercase)
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$categoryId", "$$categoryId"] },
                status: BlogStatus.PUBLISHED, // Only count published blogs
                isDeleted: DeletedEnum.NOT_DELETED, // Not deleted blogs
              },
            },
          ],
          as: "blogs",
        },
      },

      // Add count field
      {
        $addFields: {
          blogCount: { $size: "$blogs" },
        },
      },

      // Filter out categories with no published blogs (optional)
      { $match: { blogCount: { $gt: 0 } } },

      // Sort by blog count descending
      { $sort: { blogCount: -1 } },

      // Limit the results
      { $limit: limit },

      // Project only the fields we need
      {
        $project: {
          _id: 1,
          slug: 1,
          name: 1,
          blogCount: 1,
        },
      },
    ]);

    sendSuccess(
      req,
      res,
      result,
      CommonSuccessMessage.admin.blog.categoryRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.blog.categoryFailedFetch,
      500,
      error
    );
  }
};
