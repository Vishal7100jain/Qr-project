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
exports.LogoutAdmin = exports.AdminLogin = exports.handleAdminResponse = void 0;
const admin_token_1 = require("../../../common/admin/admin.token");
const sender_common_1 = require("../../../common/sender.common");
const env_config_1 = require("../../../config/env.config");
const admin_enums_1 = require("../../../constants/admin.enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const admin_model_1 = __importDefault(require("../../../models/admin/admin.model"));
const loginHistory_model_1 = __importDefault(require("../../../models/admin/loginHistory.model"));
const loginHistory_utils_1 = require("../../../utils/loginHistory.utils");
const password_utils_1 = require("../../../utils/password.utils");
const handleAdminResponse = (data, token) => {
    return {
        username: data === null || data === void 0 ? void 0 : data.username,
        email: data === null || data === void 0 ? void 0 : data.email,
        role: data === null || data === void 0 ? void 0 : data.roleId,
        _id: data === null || data === void 0 ? void 0 : data._id,
        token,
    };
};
exports.handleAdminResponse = handleAdminResponse;
const AdminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.ADMIN;
    try {
        const { email, password } = req.body;
        const admin = yield admin_model_1.default.findOne({ email }).populate("roleId").lean();
        if (!admin)
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.auth.invalidCredentails, 401);
        if (admin === null || admin === void 0 ? void 0 : admin.isDeleted) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.auth.accountDeleted, 401);
        }
        const isMatch = yield (0, password_utils_1.comparePassword)(password, admin.password);
        if (!isMatch)
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.auth.invalidCredentails, 401);
        if (admin.status != admin_enums_1.AdminStatus.ACTIVE) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.auth.accountInActive, 401);
        }
        // logout the other token and device
        yield (0, loginHistory_utils_1.updateLoginHistoryToLogout)({ personIds: String(admin === null || admin === void 0 ? void 0 : admin._id) });
        // Generate Tokens
        const token = (0, admin_token_1.generateTokenAdmin)({ _id: admin === null || admin === void 0 ? void 0 : admin._id, email: admin === null || admin === void 0 ? void 0 : admin.email });
        yield (0, loginHistory_utils_1.createLoginHistory)({
            personId: String(admin === null || admin === void 0 ? void 0 : admin._id),
            personType: admin_enums_1.PersonTypeEnum.ADMIN,
            ipAddress: req === null || req === void 0 ? void 0 : req.ip,
            userAgent: req.get("User-Agent"),
            logoutAt: new Date(Date.now() + env_config_1.envConfig.ADMIN_LOGOUT_TIME_SECOND),
        });
        return (0, sender_common_1.sendSuccess)(req, res, (0, exports.handleAdminResponse)(admin, token), `Welcome back, ${admin === null || admin === void 0 ? void 0 : admin.username}!`);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.auth.loginFailed, 500, error);
    }
});
exports.AdminLogin = AdminLogin;
const LogoutAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.moduleName = permissions_constants_1.ModuleName.ADMIN;
    try {
        const id = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id;
        const updatedLoginHistory = yield loginHistory_model_1.default.findOneAndUpdate({ personId: id }, { $set: { logoutAt: new Date() } });
        if (!updatedLoginHistory) {
            console.log("logout api failed");
        }
        return (0, sender_common_1.sendSuccess)(req, res, {}, "Logged out");
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || "Logout failed", 500, error);
    }
});
exports.LogoutAdmin = LogoutAdmin;
