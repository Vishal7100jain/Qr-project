"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const access_controller_1 = require("../../../controllers/v1/admin/access.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const accessManage_schema_1 = require("../../../schemas/admin/accessManage.schema");
const adminManage_schema_1 = require("../../../schemas/admin/adminManage.schema");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const AccessManageRoute = express_1.default.Router();
AccessManageRoute.use(adminAuth_middleware_1.isAuthenticatedAdmin);
// Create access right
AccessManageRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ACCESSMANAGEMENT, permissions_constants_1.PermissionType.CREATE), (0, validation_utils_1.validateData)({ body: accessManage_schema_1.CreateAccessPermissionSchema }), access_controller_1.CreateAccessPermission);
// Get Access Permissions
AccessManageRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ACCESSMANAGEMENT, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: adminManage_schema_1.GetAdminQuerySchema }), access_controller_1.GetAccessPermissions);
// List of Access Permissions
AccessManageRoute.get("/list", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ACCESSMANAGEMENT, permissions_constants_1.PermissionType.VIEW), access_controller_1.GetAccessPermissionList);
// Get Access Permissions
AccessManageRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ACCESSMANAGEMENT, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), access_controller_1.GetAccessPermissionsById);
// Update access by id
AccessManageRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ACCESSMANAGEMENT, permissions_constants_1.PermissionType.EDIT), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), (0, validation_utils_1.validateData)({ body: accessManage_schema_1.UpdateAccessPermissionSchema }), access_controller_1.UpdateAccessPermission);
// Delete Access Permissions
AccessManageRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ACCESSMANAGEMENT, permissions_constants_1.PermissionType.DELETE), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), access_controller_1.deleteAccessPermission);
exports.default = AccessManageRoute;
