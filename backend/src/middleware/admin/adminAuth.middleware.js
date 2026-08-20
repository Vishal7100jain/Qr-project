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
exports.VerifyAdminApiKeyMiddleware = exports.checkModulePermission = exports.isSuperAdmin = exports.isAuthenticatedAdmin = void 0;
const admin_token_1 = require("../../common/admin/admin.token");
const sender_common_1 = require("../../common/sender.common");
const env_config_1 = require("../../config/env.config");
const admin_enums_1 = require("../../constants/admin.enums");
const permissions_constants_1 = require("../../constants/permissions.constants");
const admin_model_1 = __importDefault(require("../../models/admin/admin.model"));
const loginHistory_model_1 = __importDefault(require("../../models/admin/loginHistory.model"));
const isAuthenticatedAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 1. Check if token exists
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return (0, sender_common_1.sendError)(req, res, "Authorization header is missing", 403);
        }
        // 2. Extract token from header
        const token = authHeader.split(" ")[1];
        if (!token) {
            return (0, sender_common_1.sendError)(req, res, "Authentication token is required", 403);
        }
        // 3. Verify token
        let decoded;
        try {
            decoded = (0, admin_token_1.verifyTokenAdmin)(token);
        }
        catch (jwtError) {
            return (0, sender_common_1.sendError)(req, res, jwtError.message ||
                "Invalid or expired authentication token", 406);
        }
        // 4. Find admin in database
        const admin = yield admin_model_1.default.findById((_a = decoded === null || decoded === void 0 ? void 0 : decoded.user) === null || _a === void 0 ? void 0 : _a._id)
            .select("-password")
            .populate("roleId");
        if (!admin) {
            return (0, sender_common_1.sendError)(req, res, "Admin account not found", 404);
        }
        // new step to verify is admin session is active.
        const isAdminSessionActive = yield loginHistory_model_1.default.findOne({
            personId: admin === null || admin === void 0 ? void 0 : admin._id,
            personType: admin_enums_1.PersonTypeEnum.ADMIN,
            isActive: admin_enums_1.AdminStatus.ACTIVE,
        });
        // checking the admin logout time correct or not
        if (!isAdminSessionActive ||
            isAdminSessionActive.isActive === admin_enums_1.AdminStatus.INACTIVE ||
            ((isAdminSessionActive === null || isAdminSessionActive === void 0 ? void 0 : isAdminSessionActive.logoutAt) &&
                new Date(isAdminSessionActive === null || isAdminSessionActive === void 0 ? void 0 : isAdminSessionActive.logoutAt) <= new Date())) {
            // updating admin login status to inactive when logout time is set and is true
            if ((isAdminSessionActive === null || isAdminSessionActive === void 0 ? void 0 : isAdminSessionActive.isActive) === admin_enums_1.AdminStatus.ACTIVE) {
                isAdminSessionActive.isActive = admin_enums_1.AdminStatus.INACTIVE;
                yield isAdminSessionActive.save();
            }
            return (0, sender_common_1.sendError)(req, res, "Your admin session has expired or is no longer active.", 403);
        }
        // 5. Check admin status
        if (admin.status != admin_enums_1.AdminStatus.ACTIVE) {
            return (0, sender_common_1.sendError)(req, res, "Admin account is not active. Please contact support.", 403);
        }
        // 6. Attach admin to request and proceed
        req.admin = admin;
        next();
    }
    catch (error) {
        console.error("Admin authentication error:", error);
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || "An error occurred during authentication", 500);
    }
});
exports.isAuthenticatedAdmin = isAuthenticatedAdmin;
const isSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_b = (_a = req === null || req === void 0 ? void 0 : req.admin) === null || _a === void 0 ? void 0 : _a.roleId) === null || _b === void 0 ? void 0 : _b.name) === permissions_constants_1.ADMIN_ROLES.SUPER_ADMIN ||
        req.method === "GET")
        return next();
    return (0, sender_common_1.sendError)(req, res, "This module is restricted to super administrators only.", 403);
});
exports.isSuperAdmin = isSuperAdmin;
const checkModulePermission = (module, action) => {
    return (req, res, next) => {
        var _a, _b, _c;
        const admin = req.admin;
        // Super admin bypasses all checks
        if (((_a = admin === null || admin === void 0 ? void 0 : admin.roleId) === null || _a === void 0 ? void 0 : _a.name) === permissions_constants_1.ADMIN_ROLES.SUPER_ADMIN) {
            req.moduleName = module;
            req.action = action;
            return next();
        }
        // Check if admin has permission for this module and action
        const modulePermission = ((_c = (_b = admin === null || admin === void 0 ? void 0 : admin.roleId) === null || _b === void 0 ? void 0 : _b.access) === null || _c === void 0 ? void 0 : _c.find((p) => p.module === module)) || false;
        if (!modulePermission || !modulePermission.permissions.includes(action)) {
            return (0, sender_common_1.sendError)(req, res, `Insufficient permissions: ${(0, permissions_constants_1.generatePermissionString)(module, action)} required`, 403);
        }
        // Add context to request
        req.moduleName = module;
        req.action = action;
        next();
    };
};
exports.checkModulePermission = checkModulePermission;
const VerifyAdminApiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    const apiSecret = req.headers["x-api-secret"];
    if (!apiKey || !apiSecret) {
        return (0, sender_common_1.sendError)(req, res, "API key and secret are required", 401);
    }
    if (env_config_1.envConfig.API_KEYS.ADMIN_X_API_KEY != apiKey ||
        env_config_1.envConfig.API_KEYS.ADMIN_X_API_SECRET != apiSecret) {
        return (0, sender_common_1.sendError)(req, res, "Invalid API key or secret", 403);
    }
    next();
};
exports.VerifyAdminApiKeyMiddleware = VerifyAdminApiKeyMiddleware;
