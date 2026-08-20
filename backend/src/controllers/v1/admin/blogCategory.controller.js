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
exports.GetBlogCategoryById = exports.DeleteBlogCategory = exports.UpdateBlogCategory = exports.GetBlogCategoryList = exports.GetBlogCategories = exports.CreateBlogCategory = void 0;
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const enums_1 = require("../../../constants/enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const blog_model_1 = __importDefault(require("../../../models/admin/blog.model"));
const blogCategory_model_1 = __importDefault(require("../../../models/admin/blogCategory.model"));
const CreateBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.BLOG_CATEGORY;
    try {
        const { name, status, slug } = req.body;
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const isSluginUse = yield blogCategory_model_1.default.exists({ slug });
        if (isSluginUse) {
            return (0, sender_common_1.sendError)(req, res, "Slug already in use", 400);
        }
        // Create new blog category
        const newBlogCategory = yield blogCategory_model_1.default.create({
            name,
            status,
            slug,
            createdBy: adminId,
            modifiedBy: adminId,
        });
        if (!newBlogCategory) {
            (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage === null || error_messages_1.CommonErrorMessage === void 0 ? void 0 : error_messages_1.CommonErrorMessage.admin.blog.categoryFailedCreate, 400);
        }
        // Log activity
        (0, sender_common_1.sendSuccess)(req, res, newBlogCategory, error_messages_1.CommonSuccessMessage.admin.blog.categoryCreated, 201);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || (error_messages_1.CommonErrorMessage === null || error_messages_1.CommonErrorMessage === void 0 ? void 0 : error_messages_1.CommonErrorMessage.admin.blog.categoryFailedCreate), 500, error);
    }
});
exports.CreateBlogCategory = CreateBlogCategory;
const GetBlogCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.BLOG_CATEGORY;
    try {
        const { page = 1, pageSize = 10, search = "", status } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (search) {
            filter.$or = [{ name: { $regex: search, $options: "i" } }];
        }
        if (status !== undefined && status !== null) {
            filter.status = { $eq: Number(status) };
        }
        const result = yield blogCategory_model_1.default.aggregate([
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
        const BlogCategories = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: BlogCategories,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.blog.categoryRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.categoryFailedFetch, 500, error);
    }
});
exports.GetBlogCategories = GetBlogCategories;
// Get the list of Blog categories slug and ids
const GetBlogCategoryList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.BLOG_CATEGORY;
    try {
        const result = yield blogCategory_model_1.default.find({ status: admin_enums_1.StatusEnum.ACTIVE }, "slug _id").lean();
        (0, sender_common_1.sendSuccess)(req, res, result, error_messages_1.CommonSuccessMessage.admin.blog.categoryRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.categoryFailedFetch, 500, error);
    }
});
exports.GetBlogCategoryList = GetBlogCategoryList;
const UpdateBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.BLOG_CATEGORY;
    try {
        // checking body
        const hasBodyData = req.body &&
            Object.values(req.body).some((value) => value !== undefined && value !== null && value !== "");
        if (!hasBodyData) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.oneFieldRequired, 400);
        }
        // checking slug exists
        const { id } = req.params;
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        if ((_b = req.body) === null || _b === void 0 ? void 0 : _b.slug) {
            const isSluginUse = yield blogCategory_model_1.default.exists({ slug: (_c = req.body) === null || _c === void 0 ? void 0 : _c.slug });
            if (isSluginUse) {
                return (0, sender_common_1.sendError)(req, res, "Title or slug is already in use", 400);
            }
        }
        // checking category exists
        const categoryToUpdate = yield blogCategory_model_1.default.findById(id).lean();
        if (!categoryToUpdate) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryNotFound, 400);
        }
        // getting values to update
        const updatedValues = {};
        Object.entries(req.body).map(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                updatedValues[key] = value;
            }
        });
        // checking category in use based on inactive status
        if (updatedValues.status == admin_enums_1.StatusEnum.INACTIVE &&
            (categoryToUpdate === null || categoryToUpdate === void 0 ? void 0 : categoryToUpdate.status) == admin_enums_1.StatusEnum.ACTIVE) {
            const isCategoryLinked = yield blog_model_1.default.findOne({
                categoryId: categoryToUpdate === null || categoryToUpdate === void 0 ? void 0 : categoryToUpdate._id,
                isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
                status: enums_1.BlogStatus.PUBLISHED,
            });
            if (isCategoryLinked) {
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryInUse +
                    ", you can't inactive it", 400);
            }
        }
        // updating category
        const updatedBlogCategory = yield blogCategory_model_1.default.findByIdAndUpdate(id, Object.assign({ modifiedBy: adminId }, updatedValues), { new: true });
        if (!updatedBlogCategory) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryFailedUpdation, 400);
        }
        (0, sender_common_1.sendSuccess)(req, res, updatedBlogCategory, error_messages_1.CommonSuccessMessage.admin.blog.categoryUpdateSuccess);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.blog.categoryFailedUpdation, 500, error);
    }
});
exports.UpdateBlogCategory = UpdateBlogCategory;
const DeleteBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.BLOG_CATEGORY;
    try {
        const { id } = req.params;
        const category = yield blogCategory_model_1.default.findOne({ _id: id }, "_id").lean();
        if (!category) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryNotFound, 400);
        }
        // check is category linked to any blog
        const isBlogExistWithCategory = yield blog_model_1.default.findOne({
            categoryId: id,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
            status: enums_1.BlogStatus.PUBLISHED,
        }, "_id").lean();
        if (isBlogExistWithCategory) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryInUse + ", you can't delete it", 400);
        }
        const deletedCategory = yield blogCategory_model_1.default.findByIdAndDelete(id);
        if (!deletedCategory)
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryFailedDelete);
        return (0, sender_common_1.sendSuccess)(req, res, deletedCategory, error_messages_1.CommonSuccessMessage.admin.blog.categoryDeleteSuccess);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryFailedDelete, 500, error);
    }
});
exports.DeleteBlogCategory = DeleteBlogCategory;
// Get blog category details by id
const GetBlogCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.BLOG_CATEGORY;
    try {
        const { id } = req.params;
        const result = yield blogCategory_model_1.default.findById(id).lean();
        if (!result) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryNotFound, 400);
        }
        (0, sender_common_1.sendSuccess)(req, res, result, error_messages_1.CommonSuccessMessage.admin.blog.categoryRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.blog.categoryFailedFetch, 500, error);
    }
});
exports.GetBlogCategoryById = GetBlogCategoryById;
