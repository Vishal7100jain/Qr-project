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
exports.changePassword = exports.updateProfile = exports.GetProfile = void 0;
const sender_common_1 = require("../../../common/sender.common");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const admin_model_1 = __importDefault(require("../../../models/admin/admin.model"));
const password_utils_1 = require("../../../utils/password.utils");
const adminAuth_controller_1 = require("./adminAuth.controller");
const GetProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PROFILE;
    try {
        const id = req.admin._id;
        const admin = yield admin_model_1.default.findById(id, "roleId username email _id")
            .populate({
            path: "roleId",
            options: { lean: true },
        })
            .lean();
        if (!admin) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.notFound);
        }
        (0, sender_common_1.sendSuccess)(req, res, (0, adminAuth_controller_1.handleAdminResponse)(admin, ""), "Profile retrieved successfully");
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch profile", 500);
    }
});
exports.GetProfile = GetProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PROFILE;
    try {
        const adminId = req.admin._id;
        const updateData = req.body;
        const updatedAdmin = yield admin_model_1.default.findByIdAndUpdate(adminId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!updatedAdmin) {
            return (0, sender_common_1.sendError)(req, res, "Admin not found", 404);
        }
        (0, sender_common_1.sendSuccess)(req, res, updatedAdmin, "Profile updated successfully");
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || "Failed to update profile", 500);
    }
});
exports.updateProfile = updateProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.PROFILE;
    try {
        const adminId = req.admin._id;
        const { currentPassword, newPassword } = req.body;
        const admin = yield admin_model_1.default.findById(adminId);
        if (!admin) {
            return (0, sender_common_1.sendError)(req, res, "Admin not found", 404);
        }
        // Verify current password
        const isMatch = yield (0, password_utils_1.comparePassword)(currentPassword, admin.password);
        if (!isMatch) {
            return (0, sender_common_1.sendError)(req, res, "Current password is incorrect", 400);
        }
        // Update password
        admin.password = yield (0, password_utils_1.hashPassword)(newPassword);
        yield admin.save();
        (0, sender_common_1.sendSuccess)(req, res, null, "Password changed successfully");
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || "Failed to change password", 500);
    }
});
exports.changePassword = changePassword;
