"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBlogCategoryList = exports.GetBlogById = exports.GetFilteredBlogs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const enums_1 = require("../../../constants/enums");
const error_messages_1 = require("../../../constants/error.messages");
const blog_model_1 = __importDefault(require("../../../models/admin/blog.model"));
const blogCategory_model_1 = __importDefault(require("../../../models/admin/blogCategory.model"));
// Function to batch populate createdBy for multiple blogs
const batchPopulateCreatedBy = (blogs) => __awaiter(void 0, void 0, void 0, function* () {
    const adminIds = [];
    const artistIds = [];
    const blogMap = new Map();
    // Separate blogs by creator type and map them
    blogs.forEach((blog, index) => {
        blogMap.set(index, blog);
        if (blog.createdByModel === "Admin") {
            adminIds.push(blog.createdBy);
        }
        else if (blog.createdByModel === "Artist") {
            artistIds.push(blog.createdBy);
        }
    });
    // Batch fetch admins and artists
    const Admin = mongoose_1.default.model("Admin");
    // const Artist = mongoose.model("Artist");
    const [admins] = yield Promise.all([
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
    const adminMap = new Map(admins.map((admin) => [admin === null || admin === void 0 ? void 0 : admin._id.toString(), admin]));
    // const artistMap = new Map(
    //   artists.map((artist: any) => [artist?._id.toString(), artist])
    // );
    // Assign createdBy to blogs
    return blogs.map((blog, index) => {
        const originalBlog = blogMap.get(index);
        if (blog.createdByModel === "Admin") {
            return Object.assign(Object.assign({}, originalBlog), { createdBy: adminMap.get(blog.createdBy.toString()) || "Unknown" });
        }
        else if (blog.createdByModel === "Artist") {
            // return {
            //   ...originalBlog,
            //   createdBy: artistMap.get(blog.createdBy.toString()) || "Unknown",
            // };
        }
        return Object.assign(Object.assign({}, originalBlog), { createdBy: "Unknown" });
    });
});
// Get Filtered Blogs
const GetFilteredBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const filter = {
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
            status: enums_1.BlogStatus.PUBLISHED,
        };
        if (type) {
            filter.type = Number(type);
        }
        const filteredBlogs = yield blog_model_1.default.aggregate([
            {
                $match: Object.assign({}, filter),
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
        return (0, sender_common_1.sendSuccess)(req, res, filteredBlogs, error_messages_1.CommonSuccessMessage.admin.blog.blogRetrieved);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.failedFetch, 500, error);
    }
});
exports.GetFilteredBlogs = GetFilteredBlogs;
// Get the Blog by Id
const GetBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield blog_model_1.default.findById(id, "_id title categoryId slug content description tags status type views likes contentLength hasImage createdByModel createdBy")
            .populate([{ path: "categoryId", select: "slug name" }])
            .lean();
        if (!result) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.notFound, 400);
        }
        // Manually populate createdBy and modifiedBy for the main blog
        let creator;
        if (result.createdByModel === "Admin") {
            const Admin = mongoose_1.default.model("Admin");
            creator = yield Admin.findById(result.createdBy)
                .select("username profileImage _id")
                .lean();
        }
        else if (result.createdByModel === "Artist") {
            // const Artist = mongoose.model("Artist");
            // creator = await Artist.findById(result.createdBy).select("email").lean();
        }
        // Fetch related blogs by same category (excluding current blog)
        const categoryBlogsRaw = yield blog_model_1.default.find({
            categoryId: result.categoryId,
            _id: { $ne: id },
        })
            .select("title slug excerpt featuredImage createdAt createdBy createdByModel")
            .limit(5)
            .lean();
        // Fetch related blogs by same tags (excluding current blog)
        let tagsBlogsRaw = [];
        if (result.tags && result.tags.length > 0) {
            tagsBlogsRaw = yield blog_model_1.default.find({
                tags: { $in: result.tags },
                _id: { $ne: id },
            })
                .select("title slug excerpt featuredImage createdAt createdBy createdByModel")
                .limit(5)
                .lean();
        }
        // Use Promise.all to populate categoryBlogs and tagsBlogs in parallel
        const [categoryBlogs, tagsBlogs] = yield Promise.all([
            categoryBlogsRaw.length > 0
                ? batchPopulateCreatedBy(categoryBlogsRaw)
                : [],
            tagsBlogsRaw.length > 0 ? batchPopulateCreatedBy(tagsBlogsRaw) : [],
        ]);
        const populatedResult = Object.assign(Object.assign({}, result), { createdBy: creator ? creator : "Unknown", categoryBlogs, tagsBlogs: tagsBlogs || [] });
        (0, sender_common_1.sendSuccess)(req, res, populatedResult, error_messages_1.CommonSuccessMessage.admin.blog.blogRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.failedFetch, 500, error);
    }
});
exports.GetBlogById = GetBlogById;
// Get the list of Blog categories with the most published blogs
const GetBlogCategoryList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const result = yield blogCategory_model_1.default.aggregate([
            // Match only active categories
            { $match: { status: admin_enums_1.StatusEnum.ACTIVE } },
            // Lookup to join with blogs
            {
                $lookup: {
                    from: "blogs", // Collection name (usually pluralized lowercase)
                    let: { categoryId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$categoryId", "$$categoryId"] },
                                status: enums_1.BlogStatus.PUBLISHED, // Only count published blogs
                                isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED, // Not deleted blogs
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
        (0, sender_common_1.sendSuccess)(req, res, result, error_messages_1.CommonSuccessMessage.admin.blog.categoryRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.categoryFailedFetch, 500, error);
    }
});
exports.GetBlogCategoryList = GetBlogCategoryList;
