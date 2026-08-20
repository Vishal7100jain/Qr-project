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
exports.DeleteBlog = exports.UpdateBlog = exports.GetBlogById = exports.GetBlogs = exports.CreateBlog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const enums_1 = require("../../../constants/enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const blog_model_1 = __importDefault(require("../../../models/admin/blog.model"));
const blogCategory_model_1 = __importDefault(require("../../../models/admin/blogCategory.model"));
const deleteFile_1 = require("../../../multer/deleteFile");
// Create New Blog
const CreateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    req.moduleName = permissions_constants_1.ModuleName.BLOG_POST;
    try {
        const { title, description, slug, content, categoryId, tags, status, type, } = req.body;
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const isSluginUse = yield blog_model_1.default.exists({ slug });
        if (isSluginUse) {
            (0, deleteFile_1.deleteFile)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
            return (0, sender_common_1.sendError)(req, res, "Title or slug is already in use", 400);
        }
        // checking blog category exists
        const isCategoryExist = yield blogCategory_model_1.default.findOne({ _id: categoryId, status: admin_enums_1.StatusEnum.ACTIVE }, "_id").lean();
        if (!isCategoryExist) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryNotFound, 400);
        }
        // Create new blog
        const newBlog = new blog_model_1.default({
            title,
            description,
            slug,
            content,
            categoryId,
            tags,
            type,
            approvedBy: type == enums_1.BlogType.isFeatured || type == enums_1.BlogType.isLatest
                ? adminId
                : null,
            status,
            createdByRole: enums_1.RoleEnum.ADMIN,
            createdBy: adminId,
            createdByModel: "Admin", // Set the model type
            modifiedBy: adminId,
            modifiedByModel: "Admin", // Set the model type
        });
        if ((_c = req.file) === null || _c === void 0 ? void 0 : _c.filename) {
            const fileName = (_d = req.file) === null || _d === void 0 ? void 0 : _d.filename;
            newBlog.thumbnail = `/blogs/${fileName}`;
        }
        const savedBlog = yield newBlog.save();
        if (!savedBlog) {
            (0, deleteFile_1.deleteFile)((_e = req.file) === null || _e === void 0 ? void 0 : _e.path);
            (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage === null || error_messages_1.CommonErrorMessage === void 0 ? void 0 : error_messages_1.CommonErrorMessage.admin.blog.failedCreation, 400);
        }
        (0, sender_common_1.sendSuccess)(req, res, savedBlog, error_messages_1.CommonSuccessMessage.admin.blog.blogCreated, 201);
    }
    catch (error) {
        (0, deleteFile_1.deleteFile)((_f = req.file) === null || _f === void 0 ? void 0 : _f.path);
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || (error_messages_1.CommonErrorMessage === null || error_messages_1.CommonErrorMessage === void 0 ? void 0 : error_messages_1.CommonErrorMessage.admin.blog.failedCreation), 500, error);
    }
});
exports.CreateBlog = CreateBlog;
// Get Blogs for list table
const GetBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.BLOG_POST;
    try {
        const { page = 1, pageSize = 10, status, search = "" } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }
        if (status !== undefined && status !== null) {
            filter.status = { $eq: Number(status) };
        }
        const result = yield blog_model_1.default.aggregate([
            { $match: Object.assign(Object.assign({}, filter), { isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED }) },
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
        const blogs = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: blogs,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.blog.blogRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.failedFetch, 500, error);
    }
});
exports.GetBlogs = GetBlogs;
// Get the Blog by Id
const GetBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.BLOG_POST;
    try {
        const { id } = req.params;
        const result = yield blog_model_1.default.findById(id)
            .populate([
            { path: "categoryId", select: "slug" },
            { path: "approvedBy", select: "email" },
            // Use the virtual fields for population
        ])
            .lean();
        if (!result) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.notFound, 400);
        }
        // Manually populate createdBy and modifiedBy based on model type
        let creator;
        let updator;
        if (result.createdByModel === "Admin") {
            const Admin = mongoose_1.default.model("Admin");
            creator = yield Admin.findById(result.createdBy).select("email").lean();
        }
        else if (result.createdByModel === "Artist") {
            const Artist = mongoose_1.default.model("Artist");
            creator = yield Artist.findById(result.createdBy).select("email").lean();
        }
        if (result.modifiedByModel === "Admin") {
            const Admin = mongoose_1.default.model("Admin");
            updator = yield Admin.findById(result.modifiedBy).select("email").lean();
        }
        else if (result.modifiedByModel === "Artist") {
            const Artist = mongoose_1.default.model("Artist");
            updator = yield Artist.findById(result.modifiedBy).select("email").lean();
        }
        const populatedResult = Object.assign(Object.assign({}, result), { createdBy: creator ? creator.email : "Unknown", modifiedBy: updator ? updator.email : "Unknown" });
        (0, sender_common_1.sendSuccess)(req, res, populatedResult, error_messages_1.CommonSuccessMessage.admin.blog.blogRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.failedFetch, 500, error);
    }
});
exports.GetBlogById = GetBlogById;
// Update blog by id
const UpdateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    req.moduleName = permissions_constants_1.ModuleName.BLOG_POST;
    try {
        const hasBodyData = req.body &&
            Object.values(req.body).some((value) => value !== undefined && value !== null && value !== "");
        const hasFileData = req.file && req.file.filename;
        if (!hasBodyData && !hasFileData) {
            (0, deleteFile_1.deleteFile)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.oneFieldRequired, 400);
        }
        const { id } = req.params;
        const adminId = (_b = req.admin) === null || _b === void 0 ? void 0 : _b._id;
        const { slug } = req.body;
        const isSluginUse = yield blog_model_1.default.exists({ slug, _id: { $ne: id } });
        if (isSluginUse) {
            (0, deleteFile_1.deleteFile)((_c = req.file) === null || _c === void 0 ? void 0 : _c.path);
            return (0, sender_common_1.sendError)(req, res, "Title or slug is already in use", 400);
        }
        const BlogToUpdate = yield blog_model_1.default.findOne({
            _id: id,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        }).lean();
        if (!BlogToUpdate) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.notFound, 400);
        }
        const updatedValue = {};
        Object.entries(req.body).map(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                updatedValue[key] = value;
            }
        });
        // checking blog category exists if new category id is assign
        if (updatedValue === null || updatedValue === void 0 ? void 0 : updatedValue.categoryId) {
            const isCategoryExist = yield blogCategory_model_1.default.findOne({ _id: updatedValue === null || updatedValue === void 0 ? void 0 : updatedValue.categoryId, status: admin_enums_1.StatusEnum.ACTIVE }, "_id").lean();
            if (!isCategoryExist) {
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryNotFound, 400);
            }
        }
        else {
            // checking the existing blog category is correctly exists or not
            const isCategoryExist = yield blogCategory_model_1.default.findOne({ _id: BlogToUpdate === null || BlogToUpdate === void 0 ? void 0 : BlogToUpdate.categoryId, status: admin_enums_1.StatusEnum.ACTIVE }, "_id").lean();
            if (!isCategoryExist) {
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryNotFound +
                    ", change the category pastly assigned to this blog", 400);
            }
        }
        // updating the approval admin
        if ((updatedValue === null || updatedValue === void 0 ? void 0 : updatedValue.type) != enums_1.BlogType.normal &&
            BlogToUpdate.type == enums_1.BlogType.normal) {
            updatedValue.approvedBy = adminId;
        }
        // deleting the old image
        if ((_d = req.file) === null || _d === void 0 ? void 0 : _d.filename) {
            const fullPath = path_1.default.join(process.cwd(), "public", String(BlogToUpdate === null || BlogToUpdate === void 0 ? void 0 : BlogToUpdate.thumbnail));
            (0, deleteFile_1.deleteFile)(fullPath);
            const fileName = (_e = req.file) === null || _e === void 0 ? void 0 : _e.filename;
            updatedValue.thumbnail = `/blogs/${fileName}`;
        }
        // updating blog
        const updatedBlog = yield blog_model_1.default.findByIdAndUpdate(id, Object.assign({ modifiedBy: adminId, modifiedByModel: "Admin" }, updatedValue), { new: true, runValidators: true });
        if (!updatedBlog) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.failedUpdate, 404);
        }
        (0, sender_common_1.sendSuccess)(req, res, updatedBlog, error_messages_1.CommonSuccessMessage.admin.blog.blogUpdatedSuccess);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.failedUpdate, 500, error);
    }
});
exports.UpdateBlog = UpdateBlog;
// Delete Blog by Id
const DeleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.BLOG_POST;
    try {
        const { id } = req.params;
        const blog = yield blog_model_1.default.findOne({ _id: id }, "_id");
        if (!blog) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.notFound, 400);
        }
        const deletedBlog = yield blog_model_1.default.findByIdAndUpdate(id, {
            $set: { isDeleted: admin_enums_1.DeletedEnum.DELETED },
        }, { new: true });
        return (0, sender_common_1.sendSuccess)(req, res, deletedBlog, error_messages_1.CommonSuccessMessage.admin.blog.blogDeleteSuccess);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.failedDelete, 500, error);
    }
});
exports.DeleteBlog = DeleteBlog;
