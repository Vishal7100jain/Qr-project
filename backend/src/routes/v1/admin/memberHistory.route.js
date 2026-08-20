"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const history_controller_1 = require("../../../controllers/v1/admin/history.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const MemberHistoryManagment = express_1.default.Router();
// Get Member Login History
MemberHistoryManagment.get("/login", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.MEMBER_LOGIN_HISTORY, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.PageListQuerySchema }), history_controller_1.GetMemberLoginHistory);
// Get Member Activity history
MemberHistoryManagment.get("/activity", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.MEMBER_ACTIVITY_HISTORY, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.PageListQuerySchema }), history_controller_1.GetMemberActivityHistory);
exports.default = MemberHistoryManagment;
