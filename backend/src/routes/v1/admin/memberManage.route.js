"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const memberManage_controller_1 = require("../../../controllers/v1/admin/memberManage.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const member_mutler_1 = __importDefault(require("../../../multer/member.mutler"));
const common_schema_1 = require("../../../schemas/admin/common.schema");
const memberManage_schema_1 = require("../../../schemas/admin/memberManage.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const MemberManagementRoute = express_1.default.Router();
// Get all Members data
MemberManagementRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.MEMBER_MANAGEMENT, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: common_schema_1.PageListQuerySchema }), memberManage_controller_1.GetMembers);
// Create new member
MemberManagementRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.MEMBER_MANAGEMENT, permissions_constants_1.PermissionType.CREATE), member_mutler_1.default.single("profilePic"), (0, validation_utils_1.validateData)({ body: memberManage_schema_1.CreateMemberSchema }), memberManage_controller_1.CreateMember);
// Get the Member details by id
MemberManagementRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.MEMBER_MANAGEMENT, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), memberManage_controller_1.GetMemberById);
// Update Blog by Id
MemberManagementRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.MEMBER_MANAGEMENT, permissions_constants_1.PermissionType.EDIT), member_mutler_1.default.single("profilePic"), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), (0, validation_utils_1.validateData)({ body: memberManage_schema_1.UpdateMemberSchema }), memberManage_controller_1.UpdateMemberById);
// Delete the Member by Id (soft)
MemberManagementRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.MEMBER_MANAGEMENT, permissions_constants_1.PermissionType.DELETE), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaDelete }), memberManage_controller_1.DeleteMember);
exports.default = MemberManagementRoute;
