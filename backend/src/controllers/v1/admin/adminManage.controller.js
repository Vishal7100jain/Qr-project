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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.UpdateAdmin = exports.GetAdminById = exports.GetAdmins = exports.CreateAdmin = void 0;
const path_1 = __importDefault(require("path"));
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const admin_model_1 = __importDefault(require("../../../models/admin/admin.model"));
const role_model_1 = __importDefault(require("../../../models/admin/role.model"));
const deleteFile_1 = require("../../../multer/deleteFile");
const loginHistory_utils_1 = require("../../../utils/loginHistory.utils");
const password_utils_1 = require("../../../utils/password.utils");
// Create new Admin
const CreateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    req.moduleName = permissions_constants_1.ModuleName.ADMINMANAGEMENT;
    try {
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a._id;
        const { username, email, password, roleId, status, contactNumber } = req.body;
        req.moduleDescription = `Created new admin: ${username}`;
        // Check if admin already exists
        const existingAdmin = yield admin_model_1.default.findOne({ email });
        if (existingAdmin) {
            (0, deleteFile_1.deleteFile)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.alreadyExists, 400);
        }
        const findRole = yield role_model_1.default.findOne({ _id: roleId });
        if (!findRole) {
            (0, deleteFile_1.deleteFile)((_c = req.file) === null || _c === void 0 ? void 0 : _c.path);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.notFound, 400);
        }
        // Create new admin
        const hashedPassword = yield (0, password_utils_1.hashPassword)(password);
        const newAdmin = new admin_model_1.default({
            username,
            email,
            password: hashedPassword,
            contactNumber,
            roleId,
            status: status,
            createdBy: adminId,
            modifiedBy: adminId,
        });
        if ((_d = req.file) === null || _d === void 0 ? void 0 : _d.filename) {
            const fileName = (_e = req.file) === null || _e === void 0 ? void 0 : _e.filename;
            newAdmin.profileImage = `/admin-profile/${fileName}`;
        }
        yield newAdmin.save();
        const _g = newAdmin.toObject(), { password: _ } = _g, adminData = __rest(_g, ["password"]);
        (0, sender_common_1.sendSuccess)(req, res, adminData, error_messages_1.CommonSuccessMessage.admin.adminManagement.adminCreated, 201);
    }
    catch (error) {
        (0, deleteFile_1.deleteFile)((_f = req.file) === null || _f === void 0 ? void 0 : _f.path);
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.management.creationFailed, 500, error);
    }
});
exports.CreateAdmin = CreateAdmin;
// Get Admin list
const GetAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    req.moduleName = permissions_constants_1.ModuleName.ADMINMANAGEMENT;
    try {
        const { page = 1, pageSize = 10, search = "", status } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const adminEmail = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.email;
        const filter = {
            email: { $ne: adminEmail },
        };
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (status !== undefined && status !== null) {
            filter.status = { $eq: Number(status) };
        }
        const result = yield admin_model_1.default.aggregate([
            { $match: Object.assign(Object.assign({}, filter), { isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED }) },
            { $sort: { createdAt: -1, updatedAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: Number(pageSize) },
                        {
                            $lookup: {
                                from: "roles",
                                localField: "roleId",
                                foreignField: "_id",
                                as: "role",
                            },
                        },
                        { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
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
                                username: 1,
                                email: 1,
                                status: 1,
                                contactNumber: 1,
                                profileImage: 1,
                                createdBy: "$creator.email",
                                modifiedBy: "$updator.email",
                                createdAt: 1,
                                updatedAt: 1,
                                role: "$role.name",
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);
        const admins = ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.data) || [];
        const total = ((_d = (_c = result[0]) === null || _c === void 0 ? void 0 : _c.total[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: admins,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.adminManagement.adminRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.fetchFailed, 500, error);
    }
});
exports.GetAdmins = GetAdmins;
// Get Admin by Id
const GetAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.ADMINMANAGEMENT;
    try {
        const { id } = req.params;
        const admin = yield admin_model_1.default.findById(id)
            .select("username email roleId createdBy modifiedBy status profileImage contactNumber")
            .populate([
            { path: "roleId", select: "name access" },
            { path: "createdBy", select: "email" },
            { path: "modifiedBy", select: "email" },
        ]);
        if (!admin) {
            (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.notFound, 404);
        }
        (0, sender_common_1.sendSuccess)(req, res, admin, error_messages_1.CommonSuccessMessage.admin.adminManagement.adminRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.fetchFailed, 500, error);
    }
});
exports.GetAdminById = GetAdminById;
// update the admin
const UpdateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
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
        const { username, email, password, roleId, contactNumber, status } = req.body;
        const superAdminPassword = (_c = req.body) === null || _c === void 0 ? void 0 : _c.superAdminPassword;
        const otherSuperAdminPassword = (_d = req.body) === null || _d === void 0 ? void 0 : _d.otherSuperAdminPassword;
        const admin = yield admin_model_1.default.findById(id).populate("roleId");
        if (!admin) {
            (0, deleteFile_1.deleteFile)((_e = req.file) === null || _e === void 0 ? void 0 : _e.path);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.notFound, 404);
        }
        // Prevent duplicate email
        if (email && email !== admin.email) {
            const emailExists = yield admin_model_1.default.findOne({ email });
            if (emailExists) {
                (0, deleteFile_1.deleteFile)((_f = req.file) === null || _f === void 0 ? void 0 : _f.path);
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.emailAlreadyExists, 400);
            }
        }
        // checking role exists or not
        if (roleId) {
            const existingRole = yield role_model_1.default.findById(roleId);
            if (!existingRole) {
                (0, deleteFile_1.deleteFile)((_g = req.file) === null || _g === void 0 ? void 0 : _g.path);
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.role.notFound);
            }
        }
        // Prevent changing Super Admin password unless it's self-update
        if (((_h = admin === null || admin === void 0 ? void 0 : admin.roleId) === null || _h === void 0 ? void 0 : _h.name) === "super_admin" &&
            password &&
            ((_j = req === null || req === void 0 ? void 0 : req.admin) === null || _j === void 0 ? void 0 : _j._id.toString()) !== (admin === null || admin === void 0 ? void 0 : admin._id.toString())) {
            (0, deleteFile_1.deleteFile)((_k = req.file) === null || _k === void 0 ? void 0 : _k.path);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.superAdminPasswordChangeNotAllowed, 403);
        }
        // Check if new role is super_admin
        const newRole = roleId ? yield role_model_1.default.findById(roleId) : null;
        const isPromotingToSuperAdmin = (newRole === null || newRole === void 0 ? void 0 : newRole.name) === "super_admin";
        if (isPromotingToSuperAdmin) {
            if (!superAdminPassword) {
                (0, deleteFile_1.deleteFile)((_l = req.file) === null || _l === void 0 ? void 0 : _l.path);
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management
                    .passwordRequiredToPromoteSuperAdmin, 400);
            }
            const requester = yield admin_model_1.default.findById((_m = req === null || req === void 0 ? void 0 : req.admin) === null || _m === void 0 ? void 0 : _m._id).populate("roleId");
            // Validate super_admin password
            const isMatch = yield (0, password_utils_1.comparePassword)(superAdminPassword, requester === null || requester === void 0 ? void 0 : requester.password);
            if (!isMatch) {
                (0, deleteFile_1.deleteFile)((_o = req.file) === null || _o === void 0 ? void 0 : _o.path);
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.invalidSuperAdminCredentials, 403);
            }
        }
        // Prevent accidental self-demotion (optional safety)
        if (((_q = (_p = req === null || req === void 0 ? void 0 : req.admin) === null || _p === void 0 ? void 0 : _p._id) === null || _q === void 0 ? void 0 : _q.toString()) == ((_r = admin === null || admin === void 0 ? void 0 : admin._id) === null || _r === void 0 ? void 0 : _r.toString()) &&
            newRole &&
            (newRole === null || newRole === void 0 ? void 0 : newRole.name) !== "super_admin") {
            (0, deleteFile_1.deleteFile)((_s = req.file) === null || _s === void 0 ? void 0 : _s.path);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage === null || error_messages_1.CommonErrorMessage === void 0 ? void 0 : error_messages_1.CommonErrorMessage.admin.management.cannotRemoveOwnSuperAdmin, 403);
        }
        const superAdminCount = yield admin_model_1.default.countDocuments({
            roleId: (_t = req === null || req === void 0 ? void 0 : req.admin) === null || _t === void 0 ? void 0 : _t.roleId._id,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        });
        if (superAdminCount <= 1 &&
            ((_u = admin === null || admin === void 0 ? void 0 : admin.roleId) === null || _u === void 0 ? void 0 : _u.name) === "super_admin" &&
            (newRole === null || newRole === void 0 ? void 0 : newRole.name) !== "super_admin") {
            (0, deleteFile_1.deleteFile)((_v = req.file) === null || _v === void 0 ? void 0 : _v.path);
            return (0, sender_common_1.sendError)(req, res, "Cannot delete/demote last super admin", 403);
        }
        // when admin we are updating is super admin and we try to change their role, their password is required to do that
        if (((_w = admin === null || admin === void 0 ? void 0 : admin.roleId) === null || _w === void 0 ? void 0 : _w.name) === "super_admin" &&
            newRole &&
            (newRole === null || newRole === void 0 ? void 0 : newRole.name) !== "super_admin") {
            if (!otherSuperAdminPassword) {
                (0, deleteFile_1.deleteFile)((_x = req.file) === null || _x === void 0 ? void 0 : _x.path);
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.targetPasswordRequiredToDemote, 400);
            }
            const isMatch = yield (0, password_utils_1.comparePassword)(otherSuperAdminPassword, admin === null || admin === void 0 ? void 0 : admin.password);
            if (!isMatch) {
                (0, deleteFile_1.deleteFile)((_y = req.file) === null || _y === void 0 ? void 0 : _y.path);
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.targetPasswordIncorrect, 403);
            }
        }
        if ((String(status) === String(admin_enums_1.AdminStatus.INACTIVE) ||
            String(status) === String(admin_enums_1.AdminStatus.SUSPENDED)) &&
            ((_z = admin === null || admin === void 0 ? void 0 : admin.roleId) === null || _z === void 0 ? void 0 : _z.name) === "super_admin") {
            (0, deleteFile_1.deleteFile)((_0 = req.file) === null || _0 === void 0 ? void 0 : _0.path);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.cannotUpdateSuperAdminStatus);
        }
        // Update fields
        admin.username = username || admin.username;
        admin.email = email || admin.email;
        admin.contactNumber = contactNumber || admin.contactNumber;
        admin.roleId = roleId || admin.roleId;
        admin.status = status || admin.status;
        admin.modifiedBy = adminId;
        if ((_1 = req.file) === null || _1 === void 0 ? void 0 : _1.filename) {
            const fullPath = path_1.default.join(process.cwd(), "public", admin === null || admin === void 0 ? void 0 : admin.profileImage);
            (0, deleteFile_1.deleteFile)(fullPath);
            const fileName = (_2 = req.file) === null || _2 === void 0 ? void 0 : _2.filename;
            admin.profileImage = `/admin-profile/${fileName}`;
        }
        if (password) {
            admin.password = yield (0, password_utils_1.hashPassword)(password);
        }
        const savedAdmin = yield admin.save();
        (0, loginHistory_utils_1.updateLoginHistoryToLogout)({
            personIds: [savedAdmin === null || savedAdmin === void 0 ? void 0 : savedAdmin._id],
        });
        const _4 = admin.toObject(), { password: _ } = _4, adminData = __rest(_4, ["password"]);
        (0, sender_common_1.sendSuccess)(req, res, adminData, error_messages_1.CommonSuccessMessage.admin.adminManagement.adminUpdated);
    }
    catch (error) {
        (0, deleteFile_1.deleteFile)((_3 = req.file) === null || _3 === void 0 ? void 0 : _3.path);
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.management.updateFailed, 500, error);
    }
});
exports.UpdateAdmin = UpdateAdmin;
// Delete the admin (soft delete)
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { id } = req.params;
        const superAdminPassword = (_a = req.body) === null || _a === void 0 ? void 0 : _a.superAdminPassword;
        // Prevent self-deletion
        if (id === (req === null || req === void 0 ? void 0 : req.admin._id.toString())) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.cannotDeleteOwnAccount, 400);
        }
        const targetAdmin = yield admin_model_1.default.findById(id).populate("roleId");
        if (!targetAdmin) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.notFound, 404);
        }
        // Check if trying to delete a super admin
        if (((_b = targetAdmin === null || targetAdmin === void 0 ? void 0 : targetAdmin.roleId) === null || _b === void 0 ? void 0 : _b.name) === "super_admin") {
            if (!superAdminPassword) {
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management
                    .passwordRequiredToDeleteSuperAdmin, 400);
            }
            const isMatch = yield (0, password_utils_1.comparePassword)(superAdminPassword, targetAdmin === null || targetAdmin === void 0 ? void 0 : targetAdmin.password);
            if (!isMatch) {
                return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.invalidPasswordForSuperAdmin, 403);
            }
        }
        const superAdminCount = yield admin_model_1.default.countDocuments({
            roleId: (_c = req === null || req === void 0 ? void 0 : req.admin) === null || _c === void 0 ? void 0 : _c.roleId._id,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        });
        if (superAdminCount <= 1 && ((_d = targetAdmin === null || targetAdmin === void 0 ? void 0 : targetAdmin.roleId) === null || _d === void 0 ? void 0 : _d.name) === "super_admin") {
            return (0, sender_common_1.sendError)(req, res, "Cannot delete/demote last super admin", 403);
        }
        // updated the admin deleted status to deleted
        yield admin_model_1.default.findByIdAndUpdate(id, {
            $set: { isDeleted: admin_enums_1.DeletedEnum.DELETED },
        });
        // logout that admin from there account
        yield (0, loginHistory_utils_1.updateLoginHistoryToLogout)({ personIds: targetAdmin === null || targetAdmin === void 0 ? void 0 : targetAdmin._id });
        (0, sender_common_1.sendSuccess)(req, res, null, error_messages_1.CommonSuccessMessage.admin.adminManagement.adminDeleted);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.management.deleteFailed, 500, error);
    }
});
exports.deleteAdmin = deleteAdmin;
