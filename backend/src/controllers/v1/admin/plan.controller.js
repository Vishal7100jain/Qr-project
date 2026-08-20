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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlanById = exports.GetPlansList = exports.DeletePlan = exports.UpdatePlan = exports.GetPlans = exports.CreatePlan = void 0;
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const enums_1 = require("../../../constants/enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const plans_model_1 = require("../../../models/admin/plans.model");
const handlePlanResponse = (plan) => {
    return {
        planType: enums_1.PlanTypeEnum[plan.planType],
        planName: plan.planName,
        price: plan.price,
        discount: plan.discount,
        limits: plan.limits,
        status: plan.status,
        slug: plan.slug,
    };
};
// Create Plan
const CreatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.PLANS;
    try {
        const { planType, planName, price, discount, limits, status, slug } = req.body;
        const isSluginUse = yield plans_model_1.Plans.exists({ slug });
        if (isSluginUse) {
            return (0, sender_common_1.sendError)(req, res, "Plan already exists with this slug", 400);
        }
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const newPlan = yield plans_model_1.Plans.create({
            planType,
            planName,
            slug,
            price,
            discount,
            limits,
            status,
            createdBy: adminId,
            modifiedBy: adminId,
        });
        if (!newPlan) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.createPlan, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, newPlan, error_messages_1.CommonSuccessMessage.admin.plans.createPlan);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.plans.createPlan, 500);
    }
});
exports.CreatePlan = CreatePlan;
// Get All Plans
const GetPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    req.moduleName = permissions_constants_1.ModuleName.PLANS;
    try {
        const { page = 1, pageSize = 10, search = "", status } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (search) {
            filter.$or = [
                { planName: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }
        if (status !== undefined && status !== null) {
            filter.status = { $eq: Number(status) };
        }
        yield plans_model_1.Plans.updateMany({}, { $set: { createdBy: (_a = req.admin) === null || _a === void 0 ? void 0 : _a._id, modifiedBy: (_b = req.admin) === null || _b === void 0 ? void 0 : _b._id } });
        const result = yield plans_model_1.Plans.aggregate([
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
                        {
                            $unwind: { path: "$creator", preserveNullAndEmptyArrays: true },
                        },
                        {
                            $lookup: {
                                from: "admins",
                                localField: "modifiedBy",
                                foreignField: "_id",
                                as: "updator",
                            },
                        },
                        {
                            $unwind: { path: "$updator", preserveNullAndEmptyArrays: true },
                        },
                        {
                            $project: {
                                planType: 1,
                                planName: 1,
                                slug: 1,
                                price: 1,
                                discount: 1,
                                limits: 1,
                                status: 1,
                                isDeleted: 1,
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
        const Roles = ((_c = result[0]) === null || _c === void 0 ? void 0 : _c.data) || [];
        const total = ((_e = (_d = result[0]) === null || _d === void 0 ? void 0 : _d.total[0]) === null || _e === void 0 ? void 0 : _e.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: Roles,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.plans.planRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.fetchFailed, 500, error);
    }
});
exports.GetPlans = GetPlans;
// Update Plan api
const UpdatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    req.moduleName = permissions_constants_1.ModuleName.PLANS;
    try {
        const { id } = req.params;
        const planToUpdate = yield plans_model_1.Plans.findOne({
            _id: id,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        }).lean();
        if (!planToUpdate) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.planNotFound, 400);
        }
        const newSlug = (_a = req.body) === null || _a === void 0 ? void 0 : _a.slug;
        if (newSlug) {
            const isNewSluginUse = yield plans_model_1.Plans.exists({ slug: newSlug });
            if (isNewSluginUse) {
                return (0, sender_common_1.sendError)(req, res, "Plan already exists with this slug", 400);
            }
        }
        // checking price of montly and yearly
        if (((_c = (_b = req.body) === null || _b === void 0 ? void 0 : _b.price) === null || _c === void 0 ? void 0 : _c.monthly) &&
            ((_e = (_d = req.body) === null || _d === void 0 ? void 0 : _d.price) === null || _e === void 0 ? void 0 : _e.yearly) &&
            ((_g = (_f = req.body) === null || _f === void 0 ? void 0 : _f.price) === null || _g === void 0 ? void 0 : _g.monthly) >= ((_j = (_h = req.body) === null || _h === void 0 ? void 0 : _h.price) === null || _j === void 0 ? void 0 : _j.yearly)) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.monGreaterThanYr, 400);
        }
        else if (((_l = (_k = req.body) === null || _k === void 0 ? void 0 : _k.price) === null || _l === void 0 ? void 0 : _l.monthly) &&
            ((_o = (_m = req.body) === null || _m === void 0 ? void 0 : _m.price) === null || _o === void 0 ? void 0 : _o.monthly) >= ((_p = planToUpdate === null || planToUpdate === void 0 ? void 0 : planToUpdate.price) === null || _p === void 0 ? void 0 : _p.yearly)) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.monGreaterThanYr, 400);
        }
        else if (((_r = (_q = req.body) === null || _q === void 0 ? void 0 : _q.price) === null || _r === void 0 ? void 0 : _r.yearly) &&
            ((_t = (_s = req.body) === null || _s === void 0 ? void 0 : _s.price) === null || _t === void 0 ? void 0 : _t.yearly) <= ((_u = planToUpdate === null || planToUpdate === void 0 ? void 0 : planToUpdate.price) === null || _u === void 0 ? void 0 : _u.monthly)) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.monGreaterThanYr, 400);
        }
        // Update
        const updatePlan = yield plans_model_1.Plans.findByIdAndUpdate(id, { $set: Object.assign({}, req.body) }, { new: true, lean: true });
        if (!updatePlan) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.updateFailed);
        }
        // TODO: WHEN PLAN IS INACTIVE THE ARTIST WHICH ARE LINKED TO THAT PLAN WILL GET LOGOUT AND NO LONGER CAN BE LOGGED IN AGAIN UNTIL THE PLAN IS ACTIVE AGAIN.
        return (0, sender_common_1.sendSuccess)(req, res, handlePlanResponse(updatePlan), error_messages_1.CommonSuccessMessage.admin.plans.updateSuccess);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.plans.updateFailed, 500);
    }
});
exports.UpdatePlan = UpdatePlan;
// Delete Plan api
const DeletePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PLANS;
    try {
        const { id } = req.params;
        const plan = yield plans_model_1.Plans.findOne({
            _id: id,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        }).lean();
        if (!plan) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.planNotFound, 400);
        }
        // Delete
        const DeletePlan = yield plans_model_1.Plans.findByIdAndUpdate(id, { $set: { isDeleted: admin_enums_1.DeletedEnum.DELETED } }, { new: true, lean: true });
        if (!DeletePlan) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.deleteFailed);
        }
        return (0, sender_common_1.sendSuccess)(req, res, handlePlanResponse(DeletePlan), error_messages_1.CommonSuccessMessage.admin.plans.deleteSuccess);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.plans.deleteFailed, 500);
    }
});
exports.DeletePlan = DeletePlan;
// Get Plans name list
const GetPlansList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PLANS;
    try {
        const planList = yield plans_model_1.Plans.find({
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
            status: admin_enums_1.StatusEnum.ACTIVE,
        }, "_id planName slug").lean();
        if (!planList.length) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.planNotFound, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, planList, error_messages_1.CommonSuccessMessage.admin.plans.planRetrieved);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.plans.deleteFailed, 500);
    }
});
exports.GetPlansList = GetPlansList;
// Get Plan By ID
const GetPlanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PLANS;
    try {
        const { id } = req.params;
        const plan = yield plans_model_1.Plans.findOne({
            _id: id,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        }).lean();
        if (!plan) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.plans.planNotFound, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, plan, error_messages_1.CommonSuccessMessage.admin.plans.planRetrieved);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.plans.fetchFailed, 500);
    }
});
exports.GetPlanById = GetPlanById;
