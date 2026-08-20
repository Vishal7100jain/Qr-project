import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  CreateAdmin,
  deleteAdmin,
  GetAdminById,
  GetAdmins,
  UpdateAdmin,
} from "../../../controllers/v1/admin/adminManage.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import adminProfileUpload from "../../../multer/admin.mutler";
import {
  CreateAdminSchema,
  GetAdminQuerySchema,
  UpdateAdminSchema,
} from "../../../schemas/admin/adminManage.schema";
import {
  IdSchemaGet,
  IdSchemaUpdate,
} from "../../../schemas/admin/common.schema";
import { validateData } from "../../../utils/validation.utils";

const AdminManageRoute = express.Router();

// Create admin
AdminManageRoute.post(
  "/",
  checkModulePermission(ModuleName.ADMIN, PermissionType.CREATE),
  adminProfileUpload.single("profilePhotoFile"),
  validateData({ body: CreateAdminSchema }),
  CreateAdmin
);

// Get all admins
AdminManageRoute.get(
  "/",
  checkModulePermission(ModuleName.ADMIN, PermissionType.VIEW),
  validateData({ query: GetAdminQuerySchema }),
  GetAdmins
);

// Get all admins
AdminManageRoute.get(
  "/:id",
  checkModulePermission(ModuleName.ADMIN, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetAdminById
);

// Update admin details
AdminManageRoute.put(
  "/:id",
  checkModulePermission(ModuleName.ADMIN, PermissionType.EDIT),
  adminProfileUpload.single("profilePhotoFile"),
  validateData({ params: IdSchemaUpdate }),
  validateData({ body: UpdateAdminSchema }),
  UpdateAdmin
);

// Delete admin
AdminManageRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.ADMIN, PermissionType.DELETE),
  deleteAdmin
);

export default AdminManageRoute;
