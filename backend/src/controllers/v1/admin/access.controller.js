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
exports.deleteAccessPermission = exports.UpdateAccessPermission = exports.GetAccessPermissionList = exports.CreateAccessPermission = exports.GetAccessPermissionsById = exports.GetAccessPermissions = void 0;
const sender_common_1 = require("../../../common/sender.common");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const access_model_1 = __importDefault(require("../../../models/admin/access.model"));
// Get Access Management List
const GetAccessPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.ACCESSMANAGEMENT;
    try {
        const { page = 1, pageSize = 10, search = "" } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (search) {
            filter.$or = [{ moduleName: { $regex: search, $options: "i" } }];
        }
        const result = yield access_model_1.default.aggregate([
            { $match: Object.assign({}, filter) },
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
                                moduleName: 1,
                                permissions: 1,
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
        const admins = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: admins,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.accessManagement.accessRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.accessManagement.fetchFailed, 500, error);
    }
});
exports.GetAccessPermissions = GetAccessPermissions;
// Get Access Management by id
const GetAccessPermissionsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.ACCESSMANAGEMENT;
    try {
        const { id } = req.params;
        const result = yield access_model_1.default.findById(id);
        if (!result) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.accessManagement.fetchFailed);
        }
        (0, sender_common_1.sendSuccess)(req, res, result, error_messages_1.CommonSuccessMessage.admin.accessManagement.accessRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.accessManagement.fetchFailed, 500, error);
    }
});
exports.GetAccessPermissionsById = GetAccessPermissionsById;
const CreateAccessPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.ACCESSMANAGEMENT;
    try {
        const { moduleName, permissions } = req.body;
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const isModuleNameExists = yield access_model_1.default.findOne({ moduleName }, "_id").lean();
        if (isModuleNameExists) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.accessManagement.alreadyExistModule, 400);
        }
        const permission = new access_model_1.default({
            moduleName,
            permissions,
            createdBy: adminId,
            modifiedBy: adminId,
        });
        const savedPermission = yield permission.save();
        if (!savedPermission) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.accessManagement.creationFailed, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, permission, error_messages_1.CommonSuccessMessage.admin.accessManagement.accessCreated);
    }
    catch (err) {
        return (0, sender_common_1.sendError)(req, res, (err === null || err === void 0 ? void 0 : err.message) || error_messages_1.CommonErrorMessage.admin.accessManagement.creationFailed, err);
    }
});
exports.CreateAccessPermission = CreateAccessPermission;
// Get the list of access modules name and permissions
const GetAccessPermissionList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.ACCESSMANAGEMENT;
    try {
        const result = yield access_model_1.default.find({}, "moduleName permissions _id").lean();
        (0, sender_common_1.sendSuccess)(req, res, result, error_messages_1.CommonSuccessMessage.admin.accessManagement.accessRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.accessManagement.fetchFailed, 500, error);
    }
});
exports.GetAccessPermissionList = GetAccessPermissionList;
const UpdateAccessPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.ACCESSMANAGEMENT;
    try {
        const { id } = req.params;
        const { moduleName, permissions } = req.body;
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const existingModuleName = yield access_model_1.default.findOne({ moduleName }, "_id").lean();
        if (existingModuleName) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.accessManagement.alreadyExistModule);
        }
        const updateData = {};
        if (moduleName)
            updateData.moduleName = moduleName;
        if (permissions === null || permissions === void 0 ? void 0 : permissions.length)
            updateData.permissions = permissions;
        const updatedData = yield access_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateData), { modifiedBy: adminId }));
        if (!updatedData) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.accessManagement.updateFailed);
        }
        return (0, sender_common_1.sendSuccess)(req, res, updateData, error_messages_1.CommonSuccessMessage.admin.accessManagement.accessUpdated);
    }
    catch (err) {
        return (0, sender_common_1.sendError)(req, res, (err === null || err === void 0 ? void 0 : err.message) || error_messages_1.CommonErrorMessage.admin.accessManagement.updateFailed, err);
    }
});
exports.UpdateAccessPermission = UpdateAccessPermission;
// delete access permission
const deleteAccessPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield access_model_1.default.findByIdAndDelete(id);
        if (!deleted) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.accessManagement.deleteFailed, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, deleted, error_messages_1.CommonSuccessMessage.admin.accessManagement.accessDeleted);
    }
    catch (err) {
        return (0, sender_common_1.sendError)(req, res, (err === null || err === void 0 ? void 0 : err.message) || error_messages_1.CommonErrorMessage.admin.accessManagement.deleteFailed, 400);
    }
});
exports.deleteAccessPermission = deleteAccessPermission;
