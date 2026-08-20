"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const adminManage_controller_1 = require("../../../controllers/v1/admin/adminManage.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const admin_mutler_1 = __importDefault(require("../../../multer/admin.mutler"));
const adminManage_schema_1 = require("../../../schemas/admin/adminManage.schema");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const AdminManageRoute = express_1.default.Router();
// Create admin
AdminManageRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ADMIN, permissions_constants_1.PermissionType.CREATE), admin_mutler_1.default.single("profilePhotoFile"), (0, validation_utils_1.validateData)({ body: adminManage_schema_1.CreateAdminSchema }), adminManage_controller_1.CreateAdmin);
// Get all admins
AdminManageRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ADMIN, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: adminManage_schema_1.GetAdminQuerySchema }), adminManage_controller_1.GetAdmins);
// Get all admins
AdminManageRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ADMIN, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), adminManage_controller_1.GetAdminById);
// Update admin details
AdminManageRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ADMIN, permissions_constants_1.PermissionType.EDIT), admin_mutler_1.default.single("profilePhotoFile"), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), (0, validation_utils_1.validateData)({ body: adminManage_schema_1.UpdateAdminSchema }), adminManage_controller_1.UpdateAdmin);
// Delete admin
AdminManageRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.ADMIN, permissions_constants_1.PermissionType.DELETE), adminManage_controller_1.deleteAdmin);
exports.default = AdminManageRoute;
