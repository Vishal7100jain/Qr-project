"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const role_controller_1 = require("../../../controllers/v1/admin/role.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const roleManage_schema_1 = require("../../../schemas/admin/roleManage.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const RoleManageRoute = express_1.default.Router();
// Get all role data for role management
RoleManageRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ROLEMANAGEMENT, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: roleManage_schema_1.GetRoleQuerySchema }), role_controller_1.GetRoles);
// Get Role list for dropdown
RoleManageRoute.get("/list", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ROLEMANAGEMENT, permissions_constants_1.PermissionType.VIEW), role_controller_1.GetRoleList);
// Create new Role
RoleManageRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ROLEMANAGEMENT, permissions_constants_1.PermissionType.CREATE), (0, validation_utils_1.validateData)({ body: roleManage_schema_1.CreateRoleSchema }), role_controller_1.CreateRole);
// Get the role by id
RoleManageRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ROLEMANAGEMENT, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), role_controller_1.GetRoleById);
// Update the role
RoleManageRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ROLEMANAGEMENT, permissions_constants_1.PermissionType.EDIT), (0, validation_utils_1.validateData)({ params: roleManage_schema_1.ParamsMongosId }), (0, validation_utils_1.validateData)({ body: roleManage_schema_1.UpdateRoleSchema }), role_controller_1.UpdateRole);
// Delete the role
RoleManageRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ROLEMANAGEMENT, permissions_constants_1.PermissionType.DELETE), (0, validation_utils_1.validateData)({ params: roleManage_schema_1.ParamsMongosId }), role_controller_1.DeleteRole);
exports.default = RoleManageRoute;
