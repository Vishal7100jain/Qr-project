import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { DeletedEnum, StatusEnum } from "../../../constants/admin.enums";
import { BlogStatus } from "../../../constants/enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import Blog from "../../../models/admin/blog.model";
import BlogCategory from "../../../models/admin/blogCategory.model";

export const CreateBlogCategory = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_CATEGORY;

  try {
    const { name, status, slug } = req.body;
    const adminId = req?.admin?._id;

    const isSluginUse = await BlogCategory.exists({ slug });
    if (isSluginUse) {
      return sendError(req, res, "Slug already in use", 400);
    }

    // Create new blog category
    const newBlogCategory = await BlogCategory.create({
      name,
      status,
      slug,
      createdBy: adminId,
      modifiedBy: adminId,
    });

    if (!newBlogCategory) {
      sendError(
        req,
        res,
        CommonErrorMessage?.admin.blog.categoryFailedCreate,
        400
      );
    }

    // Log activity
    sendSuccess(
      req,
      res,
      newBlogCategory,
      CommonSuccessMessage.admin.blog.categoryCreated,
      201
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage?.admin.blog.categoryFailedCreate,
      500,
      error
    );
  }
};

export const GetBlogCategories = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_CATEGORY;

  try {
    const { page = 1, pageSize = 10, search = "", status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    if (status !== undefined && status !== null) {
      filter.status = { $eq: Number(status) };
    }

    const result = await BlogCategory.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
            {
              $lookup: {
                from: "admins",
                localField: "createdBy",
                foreignField: "_id",
                as: "creator",
              },
            },
            { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: "admins",
                localField: "modifiedBy",
                foreignField: "_id",
                as: "updator",
              },
            },
            { $unwind: { path: "$updator", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                name: 1,
                slug: 1,
                status: 1,
                createdBy: "$creator.email",
                modifiedBy: "$updator.email",
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const BlogCategories = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: BlogCategories,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
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

// Get the list of Blog categories slug and ids
export const GetBlogCategoryList = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_CATEGORY;

  try {
    const result = await BlogCategory.find(
      { status: StatusEnum.ACTIVE },
      "slug _id"
    ).lean();
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

export const UpdateBlogCategory = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_CATEGORY;
  try {
    // checking body
    const hasBodyData =
      req.body &&
      Object.values(req.body).some(
        (value) => value !== undefined && value !== null && value !== ""
      );

    if (!hasBodyData) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.oneFieldRequired,
        400
      );
    }

    // checking slug exists
    const { id } = req.params;
    const adminId = req?.admin?._id;
    if (req.body?.slug) {
      const isSluginUse = await BlogCategory.exists({ slug: req.body?.slug });
      if (isSluginUse) {
        return sendError(req, res, "Title or slug is already in use", 400);
      }
    }

    // checking category exists
    const categoryToUpdate = await BlogCategory.findById(id).lean();
    if (!categoryToUpdate) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.blog.categoryNotFound,
        400
      );
    }

    // getting values to update
    const updatedValues: any = {};
    Object.entries(req.body).map(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        updatedValues[key] = value;
      }
    });

    // checking category in use based on inactive status
    if (
      updatedValues.status == StatusEnum.INACTIVE &&
      categoryToUpdate?.status == StatusEnum.ACTIVE
    ) {
      const isCategoryLinked = await Blog.findOne({
        categoryId: categoryToUpdate?._id,
        isDeleted: DeletedEnum.NOT_DELETED,
        status: BlogStatus.PUBLISHED,
      });

      if (isCategoryLinked) {
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.blog.categoryInUse +
            ", you can't inactive it",
          400
        );
      }
    }

    // updating category
    const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
      id,
      {
        modifiedBy: adminId,
        ...updatedValues,
      },
      { new: true }
    );

    if (!updatedBlogCategory) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.blog.categoryFailedUpdation,
        400
      );
    }

    sendSuccess(
      req,
      res,
      updatedBlogCategory,
      CommonSuccessMessage.admin.blog.categoryUpdateSuccess
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.blog.categoryFailedUpdation,
      500,
      error
    );
  }
};

export const DeleteBlogCategory = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_CATEGORY;

  try {
    const { id } = req.params;
    const category = await BlogCategory.findOne({ _id: id }, "_id").lean();
    if (!category) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.blog.categoryNotFound,
        400
      );
    }

    // check is category linked to any blog
    const isBlogExistWithCategory = await Blog.findOne(
      {
        categoryId: id,
        isDeleted: DeletedEnum.NOT_DELETED,
        status: BlogStatus.PUBLISHED,
      },
      "_id"
    ).lean();

    if (isBlogExistWithCategory) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.blog.categoryInUse + ", you can't delete it",
        400
      );
    }

    const deletedCategory = await BlogCategory.findByIdAndDelete(id);
    if (!deletedCategory)
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.blog.categoryFailedDelete
      );

    return sendSuccess(
      req,
      res,
      deletedCategory,
      CommonSuccessMessage.admin.blog.categoryDeleteSuccess
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      CommonErrorMessage.admin.blog.categoryFailedDelete,
      500,
      error
    );
  }
};

// Get blog category details by id
export const GetBlogCategoryById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BLOG_CATEGORY;
  try {
    const { id } = req.params;
    const result = await BlogCategory.findById(id).lean();

    if (!result) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.blog.categoryNotFound,
        400
      );
    }
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
      CommonErrorMessage.admin.blog.categoryFailedFetch,
      500,
      error
    );
  }
};
