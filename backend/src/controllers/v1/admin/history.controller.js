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
exports.GetMemberActivityHistory = exports.GetMemberLoginHistory = exports.GetAdminActivityHistory = exports.GetAdminLoginHistory = void 0;
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const enums_1 = require("../../../constants/enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const activityLog_model_1 = require("../../../models/admin/activityLog.model");
const loginHistory_model_1 = __importDefault(require("../../../models/admin/loginHistory.model"));
const memberLoginHistory_model_1 = __importDefault(require("../../../models/member/memberLoginHistory.model"));
// Get Admin Login History
const GetAdminLoginHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    req.moduleName = permissions_constants_1.ModuleName.ADMIN_LOGIN_HISTORY;
    try {
        const admin = req === null || req === void 0 ? void 0 : req.admin;
        const { page = 1, pageSize = 10, emailSearch = "", // admin email search
        status, // isActive filter
        type, // personType: ADMIN (1) or ARTIST (2)
         } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const matchStage = {
            personType: Number(type) || admin_enums_1.PersonTypeEnum.ADMIN, // default ADMIN
        };
        if (status !== undefined && status !== null) {
            matchStage.isActive = Number(status);
        }
        const superAdminFilter = {};
        if (((_a = admin === null || admin === void 0 ? void 0 : admin.roleId) === null || _a === void 0 ? void 0 : _a.name) !== "super_admin") {
            superAdminFilter["role.name"] = { $ne: "super_admin" };
        }
        const result = yield loginHistory_model_1.default.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "admins",
                    localField: "personId",
                    foreignField: "_id",
                    as: "admin",
                },
            },
            { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "roles",
                    localField: "admin.roleId",
                    foreignField: "_id",
                    as: "role",
                },
            },
            { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
            { $match: superAdminFilter },
            ...(emailSearch
                ? [
                    {
                        $match: {
                            "admin.email": {
                                $regex: String(emailSearch).trim(),
                                $options: "i",
                            },
                        },
                    },
                ]
                : []),
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: Number(pageSize) },
                        {
                            $project: {
                                _id: 1,
                                loginAt: 1,
                                logoutAt: 1,
                                ipAddress: 1,
                                userAgent: 1,
                                isActive: 1,
                                personType: 1,
                                admin: {
                                    email: "$admin.email",
                                    _id: "$admin._id",
                                },
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);
        const loginHistory = ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.data) || [];
        const total = ((_d = (_c = result[0]) === null || _c === void 0 ? void 0 : _c.total[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: loginHistory,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, (((_e = admin_enums_1.PersonTypeEnum[Number(type)]) === null || _e === void 0 ? void 0 : _e.toLowerCase()) ||
            String(admin_enums_1.PersonTypeEnum[1]).toLowerCase()) +
            error_messages_1.CommonSuccessMessage.admin.history.loginRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.history.loginFetchFailed, 500, error);
    }
});
exports.GetAdminLoginHistory = GetAdminLoginHistory;
// Get Admin Activity History
const GetAdminActivityHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.ADMIN_ACTIVITY_HISTORY;
    try {
        const admin = req === null || req === void 0 ? void 0 : req.admin;
        const { page = 1, pageSize = 10, search = "", statusCode, emailSearch, } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        // 1. Build base filter (ensure pRole is always first for index usage)
        const filter = { pRole: enums_1.RoleEnum.ADMIN };
        // 2. Apply search filters
        if (search) {
            const searchRegex = new RegExp(String(search).trim(), "i");
            filter.$or = [{ mo: searchRegex }, { url: searchRegex }];
        }
        if (statusCode && !isNaN(Number(statusCode))) {
            filter.sC = Number(statusCode);
        }
        // 3. Get count FIRST (with minimal filtering)
        const totalPromise = activityLog_model_1.ActivityLog.countDocuments(filter);
        // 4. Main query pipeline
        const pipeline = [
            { $match: filter },
            { $sort: { createdAt: -1, updatedAt: 1 } },
            { $skip: skip },
            { $limit: Number(pageSize) },
            {
                $lookup: {
                    from: "admins",
                    localField: "pId",
                    foreignField: "_id",
                    as: "admin",
                    // Only get needed fields
                    pipeline: [
                        { $project: { email: 1, roleId: 1 } },
                        ...(((_a = admin === null || admin === void 0 ? void 0 : admin.roleId) === null || _a === void 0 ? void 0 : _a.name) !== "super_admin"
                            ? [
                                {
                                    $lookup: {
                                        from: "roles",
                                        localField: "roleId",
                                        foreignField: "_id",
                                        as: "role",
                                        pipeline: [{ $match: { name: { $ne: "super_admin" } } }],
                                    },
                                },
                            ]
                            : []),
                        { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
                    ],
                },
            },
            { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
            // Apply email filter AFTER lookup to avoid complex sub-pipeline
            ...(emailSearch
                ? [
                    {
                        $match: {
                            "admin.email": new RegExp(String(emailSearch).trim(), "i"),
                        },
                    },
                ]
                : []),
            {
                $project: {
                    person: { email: "$admin.email", _id: "$admin._id" },
                    mo: 1,
                    ac: 1,
                    des: 1,
                    url: 1,
                    ipAdd: 1,
                    agent: 1,
                    sC: 1,
                    tiToRes: 1,
                    createdAt: 1,
                },
            },
        ];
        // 5. Execute queries sequentially (better for connection pooling)
        const total = yield totalPromise;
        const data = yield activityLog_model_1.ActivityLog.aggregate(pipeline);
        (0, sender_common_1.sendSuccess)(req, res, {
            data,
            total,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.history.activityRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.history.activityFetchFailed, 500, error);
    }
});
exports.GetAdminActivityHistory = GetAdminActivityHistory;
// Get Member Login History
const GetMemberLoginHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.MEMBER_LOGIN_HISTORY;
    try {
        const { page = 1, pageSize = 10, search = "", status } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (status !== undefined && status !== null) {
            if (Number(status) == admin_enums_1.StatusEnum.ACTIVE) {
                filter.logoutAt = { $gt: new Date() };
            }
            else if (Number(status) == admin_enums_1.StatusEnum.INACTIVE) {
                filter.logoutAt = { $lt: new Date() };
            }
        }
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const result = yield memberLoginHistory_model_1.default.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1, updatedAt: 1 } },
            {
                $lookup: {
                    from: "members",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member",
                },
            },
            { $unwind: { path: "$member", preserveNullAndEmptyArrays: true } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: Number(pageSize) },
                        {
                            $project: {
                                member: "$member",
                                oAuthProviderId: 1,
                                email: 1,
                                token: 1,
                                oAuthType: 1,
                                isSuccessful: 1,
                                loginAt: 1,
                                logoutAt: 1,
                                ipAddress: 1,
                                userAgent: 1,
                                isActive: {
                                    $cond: {
                                        if: { $gt: ["$logoutAt", new Date()] },
                                        then: 1,
                                        else: 0,
                                    },
                                },
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);
        const loginHistory = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: loginHistory,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.history.loginRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.history.loginFetchFailed, 500, error);
    }
});
exports.GetMemberLoginHistory = GetMemberLoginHistory;
// Get Member Activity History
const GetMemberActivityHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.MEMBER_ACTIVITY_HISTORY;
    try {
        const { page = 1, pageSize = 10, search = "", statusCode, emailSearch, } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {
            pRole: enums_1.RoleEnum.MEMBER,
        };
        if (search) {
            filter.$or = [
                { mo: { $regex: String(search).trim(), $options: "i" } },
                { url: { $regex: String(search).trim(), $options: "i" } },
            ];
        }
        if (Number(statusCode) && statusCode !== undefined && statusCode !== null) {
            filter.sC = { $eq: Number(statusCode) };
        }
        const result = yield activityLog_model_1.ActivityLog.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: "members",
                    localField: "pId",
                    foreignField: "_id",
                    as: "member",
                },
            },
            { $unwind: { path: "$member", preserveNullAndEmptyArrays: true } },
            ...(emailSearch
                ? [
                    {
                        $match: {
                            "member.email": {
                                $regex: String(emailSearch).trim(),
                                $options: "i",
                            },
                        },
                    },
                ]
                : []),
            { $sort: { createdAt: -1, updatedAt: 1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: Number(pageSize) },
                        {
                            $project: {
                                person: { email: "$member.email", _id: "$member._id" },
                                mo: 1,
                                ac: 1,
                                des: 1,
                                url: 1,
                                ipAdd: 1,
                                agent: 1,
                                sC: 1,
                                tiToRes: 1,
                                createdAt: 1,
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);
        const activity = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: activity,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.history.activityRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.history.activityFetchFailed, 500, error);
    }
});
exports.GetMemberActivityHistory = GetMemberActivityHistory;
