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
exports.GetPlanFaqById = exports.DeletePlanFAQ = exports.UpdatePlanFAQ = exports.GetPlanFAQs = exports.CreatePlanFAQ = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const plans_model_1 = require("../../../models/admin/plans.model");
const handlePlanFAQResponse = (faq) => {
    return {
        _id: faq._id,
        question: faq === null || faq === void 0 ? void 0 : faq.question,
        answer: faq === null || faq === void 0 ? void 0 : faq.answer,
        planIds: faq === null || faq === void 0 ? void 0 : faq.planIds,
        status: faq === null || faq === void 0 ? void 0 : faq.status,
        createdBy: faq === null || faq === void 0 ? void 0 : faq.createdBy,
        modifiedBy: faq === null || faq === void 0 ? void 0 : faq.modifiedBy,
        createdAt: faq === null || faq === void 0 ? void 0 : faq.createdAt,
        updatedAt: faq === null || faq === void 0 ? void 0 : faq.updatedAt,
    };
};
// Plan FAQs Controllers
const CreatePlanFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.PLANFAQ;
    try {
        const { planIds, question, answer, status = admin_enums_1.StatusEnum.ACTIVE } = req.body;
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
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.planNotFound, 404);
        }
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const newFAQ = yield plans_model_1.PlanFAQ.create({
            question,
            answer,
            planIds,
            status,
            createdBy: adminId,
            modifiedBy: adminId,
        });
        if (!newFAQ) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.create, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, handlePlanFAQResponse(newFAQ), error_messages_1.CommonSuccessMessage.admin.planFAQ.create);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.planFAQ.create, 500);
    }
});
exports.CreatePlanFAQ = CreatePlanFAQ;
// Get Plan FAQs
const GetPlanFAQs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.PLANFAQ;
    try {
        const { page = 1, pageSize = 10, search = "", status } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const baseFilter = {};
        if (status !== undefined && status !== null) {
            baseFilter.status = { $eq: Number(status) };
        }
        const result = yield plans_model_1.PlanFAQ.aggregate([
            { $match: baseFilter },
            { $sort: { createdAt: -1, updatedAt: -1 } },
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
            // ✅ Apply search across FAQ fields + ALL plans inside array
            ...(search
                ? [
                    {
                        $match: {
                            $or: [
                                { question: { $regex: search, $options: "i" } },
                                { answer: { $regex: search, $options: "i" } },
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
                                question: 1,
                                answer: 1,
                                status: 1,
                                plans: 1, // ✅ stays array
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
        const faqs = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: faqs,
            total,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.planFAQ.retrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.fetchFailed, 500, error);
    }
});
exports.GetPlanFAQs = GetPlanFAQs;
// Update Plan FAQ By Id
const UpdatePlanFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.PLANFAQ;
    try {
        const { id } = req.params;
        const updateData = req.body;
        const faq = yield plans_model_1.PlanFAQ.findOne({ _id: id }).lean();
        if (!faq) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.FaqNotFound, 404);
        }
        if (updateData === null || updateData === void 0 ? void 0 : updateData.planIds) {
            // Check if plan exists and is not deleted
            const planExists = yield plans_model_1.Plans.aggregate([
                {
                    $match: {
                        _id: {
                            $in: (_a = updateData === null || updateData === void 0 ? void 0 : updateData.planIds) === null || _a === void 0 ? void 0 : _a.map((item) => mongoose_1.default.Types.ObjectId.createFromHexString(String(item))),
                        },
                        isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
                    },
                },
            ]);
            if (planExists.length !== ((_b = updateData === null || updateData === void 0 ? void 0 : updateData.planIds) === null || _b === void 0 ? void 0 : _b.length)) {
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.planNotFound, 404);
            }
        }
        const adminId = (_c = req.admin) === null || _c === void 0 ? void 0 : _c._id;
        const updatedFAQ = yield plans_model_1.PlanFAQ.findByIdAndUpdate(id, { $set: Object.assign(Object.assign({}, updateData), { modifiedBy: adminId }) }, { new: true, lean: true });
        if (!updatedFAQ) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.updateFailed, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, handlePlanFAQResponse(updatedFAQ), error_messages_1.CommonSuccessMessage.admin.planFAQ.update);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.planFAQ.updateFailed, 500);
    }
});
exports.UpdatePlanFAQ = UpdatePlanFAQ;
// Delete Plan Faq By Id
const DeletePlanFAQ = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PLANFAQ;
    try {
        const { id } = req.params;
        const faq = yield plans_model_1.PlanFAQ.findOne({ _id: id });
        if (!faq) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.FaqNotFound, 404);
        }
        const deletedFAQ = yield plans_model_1.PlanFAQ.findByIdAndDelete(id);
        if (!deletedFAQ) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.deleteFailed, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, handlePlanFAQResponse(deletedFAQ), error_messages_1.CommonSuccessMessage.admin.planFAQ.delete);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.planFAQ.deleteFailed, 500);
    }
});
exports.DeletePlanFAQ = DeletePlanFAQ;
// Get Plan Faq By ID
const GetPlanFaqById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PLANFAQ;
    try {
        const { id } = req.params;
        const planFAQ = yield plans_model_1.PlanFAQ.findOne({
            _id: id,
        })
            .populate({ path: "planIds", select: "planName slug planType" })
            .lean();
        if (!planFAQ) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.planFAQ.FaqNotFound, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, planFAQ, error_messages_1.CommonSuccessMessage.admin.planFAQ.retrieved);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.planFAQ.FaqNotFound, 500);
    }
});
exports.GetPlanFaqById = GetPlanFaqById;
