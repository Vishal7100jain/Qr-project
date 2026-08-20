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
exports.GetPlanFeatureById = exports.DeletePlanFeature = exports.UpdatePlanFeature = exports.GetPlanFeatures = exports.CreatePlanFeature = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const plans_model_1 = require("../../../models/admin/plans.model");
// Common response handlers
const handlePlanFeatureResponse = (feature) => {
    return {
        _id: feature._id,
        feature: feature.feature,
        planIds: feature.planIds,
        status: feature.status,
        createdBy: feature.createdBy,
        modifiedBy: feature.modifiedBy,
        createdAt: feature.createdAt,
        updatedAt: feature.updatedAt,
    };
};
// Plan Features Create
const CreatePlanFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.PLANFEATURE;
    try {
        const { planIds, feature, status } = req.body;
        // Check if plan exists and is not deleted
        const planExists = yield plans_model_1.Plans.aggregate([
            {
                $match: {
                    _id: {
                        $in: planIds === null || planIds === void 0 ? void 0 : planIds.map((item) => mongoose_1.default.Types.ObjectId.createFromHexString(String(item))),
                    },
                    isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
                },
            },
        ]);
        if (planExists.length !== (planIds === null || planIds === void 0 ? void 0 : planIds.length)) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.planNotFound, 404);
        }
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const newFeature = yield plans_model_1.PlanFeature.create({
            feature,
            planIds,
            status,
            createdBy: adminId,
            modifiedBy: adminId,
        });
        if (!newFeature) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.createPF, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, handlePlanFeatureResponse(newFeature), error_messages_1.CommonSuccessMessage.admin.planFeature.create);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.planFeature.createPF, 500);
    }
});
exports.CreatePlanFeature = CreatePlanFeature;
// Get Plan Feature list for the table
const GetPlanFeatures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.PLANFEATURE;
    try {
        const { page = 1, pageSize = 10, search = "", status } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (status !== undefined && status !== null) {
            filter.status = { $eq: Number(status) };
        }
        const result = yield plans_model_1.PlanFeature.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1, updatedAt: -1 } },
            // ✅ Apply search across FAQ fields + ALL plans inside array
            {
                $lookup: {
                    from: "plans",
                    localField: "planIds",
                    foreignField: "_id",
                    as: "plans",
                    pipeline: [
                        {
                            $project: { planType: 1, planName: 1, slug: 1, status: 1 },
                        },
                    ],
                },
            },
            ...(search
                ? [
                    {
                        $match: {
                            $or: [
                                { feature: { $regex: search, $options: "i" } },
                                { "plans.planName": { $regex: search, $options: "i" } },
                                { "plans.slug": { $regex: search, $options: "i" } },
                            ],
                        },
                    },
                ]
                : []),
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
                                as: "createdBy",
                                pipeline: [
                                    { $project: { username: 1, email: 1, profileImage: 1 } },
                                ],
                            },
                        },
                        {
                            $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
                        },
                        {
                            $lookup: {
                                from: "admins",
                                localField: "modifiedBy",
                                foreignField: "_id",
                                as: "modifiedBy",
                                pipeline: [
                                    { $project: { username: 1, email: 1, profileImage: 1 } },
                                ],
                            },
                        },
                        {
                            $unwind: {
                                path: "$modifiedBy",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                feature: 1,
                                status: 1,
                                plans: 1,
                                createdBy: 1,
                                modifiedBy: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);
        const features = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: features,
            total,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.planFeature.retrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.fetchFailed, 500, error);
    }
});
exports.GetPlanFeatures = GetPlanFeatures;
// Update Plan Feature by id
const UpdatePlanFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.PLANFEATURE;
    try {
        const { id } = req.params;
        const updateData = req.body;
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const feature = yield plans_model_1.PlanFeature.findOne({ _id: id }).lean();
        if (!feature) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.featureNotFound, 404);
        }
        if (updateData === null || updateData === void 0 ? void 0 : updateData.planIds) {
            // Check if plan exists and is not deleted
            const planExists = yield plans_model_1.Plans.aggregate([
                {
                    $match: {
                        _id: {
                            $in: (_b = updateData === null || updateData === void 0 ? void 0 : updateData.planIds) === null || _b === void 0 ? void 0 : _b.map((item) => mongoose_1.default.Types.ObjectId.createFromHexString(String(item))),
                        },
                        isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
                    },
                },
            ]);
            if (planExists.length !== ((_c = updateData === null || updateData === void 0 ? void 0 : updateData.planIds) === null || _c === void 0 ? void 0 : _c.length)) {
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.planNotFound, 404);
            }
        }
        const updatedFeature = yield plans_model_1.PlanFeature.findByIdAndUpdate(id, { $set: Object.assign(Object.assign({}, updateData), { modifiedBy: adminId }) }, { new: true, lean: true });
        if (!updatedFeature) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.updateFailed, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, handlePlanFeatureResponse(updatedFeature), error_messages_1.CommonSuccessMessage.admin.planFeature.update);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.planFeature.updateFailed, 500);
    }
});
exports.UpdatePlanFeature = UpdatePlanFeature;
// delete Plan feature
const DeletePlanFeature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PLANFEATURE;
    try {
        const { id } = req.params;
        const feature = yield plans_model_1.PlanFeature.findOne({ _id: id });
        if (!feature) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.featureNotFound, 404);
        }
        const deletedFeature = yield plans_model_1.PlanFeature.findByIdAndDelete(id);
        if (!deletedFeature) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.deleteFailed, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, handlePlanFeatureResponse(deletedFeature), error_messages_1.CommonSuccessMessage.admin.planFeature.delete);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.planFeature.deleteFailed, 500);
    }
});
exports.DeletePlanFeature = DeletePlanFeature;
// Get Plan Feature By ID
const GetPlanFeatureById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PLANFEATURE;
    try {
        const { id } = req.params;
        const planFeature = yield plans_model_1.PlanFeature.findOne({
            _id: id,
        })
            .populate({ path: "planIds", select: "planName slug planType" })
            .lean();
        if (!planFeature) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFeature.featureNotFound, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, planFeature, error_messages_1.CommonSuccessMessage.admin.planFeature.retrieved);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.planFeature.featureNotFound, 500);
    }
});
exports.GetPlanFeatureById = GetPlanFeatureById;
