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
exports.GetRoleById = exports.DeleteRole = exports.UpdateRole = exports.GetRoleList = exports.GetRoles = exports.CreateRole = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sender_common_1 = require("../../../common/sender.common");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const admin_model_1 = __importDefault(require("../../../models/admin/admin.model"));
const role_model_1 = __importDefault(require("../../../models/admin/role.model"));
const loginHistory_utils_1 = require("../../../utils/loginHistory.utils");
const UpdateAdminsRoleToDefaultOnDelete = (roleId, session) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultRole = yield role_model_1.default.findOne({ name: "default" }).session(session);
    if (!defaultRole) {
        throw new Error("Default role not found");
    }
    // Find all admins with the role being deleted
    const adminsToUpdate = yield admin_model_1.default.find({ roleId }, "_id").session(session);
    const adminIds = adminsToUpdate.map((admin) => admin._id);
    // Update all admins having this role to default role
    yield admin_model_1.default.updateMany({ roleId }, // all admins with deleted role
    { $set: { roleId: defaultRole._id } }, { session });
    yield (0, loginHistory_utils_1.updateLoginHistoryToLogout)(adminIds);
});
const CreateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.ROLEMANAGEMENT;
    try {
        const { name, description, access } = req.body;
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        // Check if role already exists
        const existingRole = yield role_model_1.default.findOne({ name });
        if (existingRole) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.nameAlreadyExists, 400);
        }
        // Create new role
        const newRole = new role_model_1.default({
            name,
            description,
            access: access || [],
            createdBy: adminId,
            modifiedBy: adminId,
        });
        yield newRole.save();
        // Log activity
        (0, sender_common_1.sendSuccess)(req, res, newRole, error_messages_1.CommonSuccessMessage.admin.role.roleCreated, 201);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || (error_messages_1.CommonErrorMessage === null || error_messages_1.CommonErrorMessage === void 0 ? void 0 : error_messages_1.CommonErrorMessage.admin.role.creationFailed), 500, error);
    }
});
exports.CreateRole = CreateRole;
const GetRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.ROLEMANAGEMENT;
    try {
        const { page = 1, pageSize = 10, search = "" } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        const result = yield role_model_1.default.aggregate([
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
                                access: 1,
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
        const Roles = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: Roles,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.role.roleRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.role.fetchFailed, 500, error);
    }
});
exports.GetRoles = GetRoles;
// Get the list of roles name and ids
const GetRoleList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.ROLEMANAGEMENT;
    try {
        const result = yield role_model_1.default.find({}, "name _id").lean();
        (0, sender_common_1.sendSuccess)(req, res, result, error_messages_1.CommonSuccessMessage.admin.role.roleRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.role.fetchFailed, 500, error);
    }
});
exports.GetRoleList = GetRoleList;
const UpdateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.ROLEMANAGEMENT;
    try {
        const { id } = req.params;
        const { name, description, access } = req.body;
        // No one as write to update the default role.
        const isUpdatingDefaultRole = yield role_model_1.default.findById(id, "name").lean();
        if ((isUpdatingDefaultRole === null || isUpdatingDefaultRole === void 0 ? void 0 : isUpdatingDefaultRole.name) === "default" &&
            name &&
            name !== "default") {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.cannotUpdateDefaultRole, 400);
        }
        if ((isUpdatingDefaultRole === null || isUpdatingDefaultRole === void 0 ? void 0 : isUpdatingDefaultRole.name) === "super_admin" &&
            name &&
            name !== "super_admin") {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.cannotUpdateSuperAdmin, 400);
        }
        const findRoleWithExistingName = yield role_model_1.default.findOne({ name }, "_id").lean();
        if (findRoleWithExistingName) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.nameAlreadyExists, 400);
        }
        const adminId = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const updatedRole = yield role_model_1.default.findByIdAndUpdate(id, { name, description, access, modifiedBy: adminId }, { new: true, runValidators: true });
        if (!updatedRole) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.notFound, 404);
        }
        const adminsWithRole = yield admin_model_1.default.find({ roleId: id }, "_id").lean();
        const ids = adminsWithRole.map((admin) => admin._id.toString());
        (0, loginHistory_utils_1.updateLoginHistoryToLogout)({
            personIds: Array.from(ids),
        });
        (0, sender_common_1.sendSuccess)(req, res, updatedRole, error_messages_1.CommonSuccessMessage.admin.role.updateSuccess);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.role.updateFailed, 500, error);
    }
});
exports.UpdateRole = UpdateRole;
const DeleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.ROLEMANAGEMENT;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const findRoleById = yield role_model_1.default.findOne({ _id: id }).session(session);
        if (!findRoleById) {
            yield session.abortTransaction();
            session.endSession();
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.notFound, 400);
        }
        if (findRoleById.name === "default") {
            yield session.abortTransaction();
            session.endSession();
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.cannotDeleteDefaultRole, 400);
        }
        if (findRoleById.name === "super_admin") {
            yield session.abortTransaction();
            session.endSession();
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.cannotDeleteSuperAdmin, 400);
        }
        // First, delete the role
        const deletedRole = yield role_model_1.default.findByIdAndDelete(id, { session });
        // Then update all admins that had this role
        yield UpdateAdminsRoleToDefaultOnDelete(id, session);
        yield session.commitTransaction();
        session.endSession();
        return (0, sender_common_1.sendSuccess)(req, res, deletedRole, error_messages_1.CommonSuccessMessage.admin.role.deleteSuccess);
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.deleteFailed, 500, error);
    }
});
exports.DeleteRole = DeleteRole;
// Get Role by id
const GetRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.ROLEMANAGEMENT;
    try {
        const { id } = req.params;
        const result = yield role_model_1.default.findById(id).lean();
        if (!result) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.fetchFailed);
        }
        (0, sender_common_1.sendSuccess)(req, res, result, error_messages_1.CommonSuccessMessage.admin.role.roleRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.fetchFailed, 500, error);
    }
});
exports.GetRoleById = GetRoleById;
