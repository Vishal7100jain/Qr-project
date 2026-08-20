import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  CreateAccessPermission,
  deleteAccessPermission,
  GetAccessPermissionList,
  GetAccessPermissions,
  GetAccessPermissionsById,
  UpdateAccessPermission,
} from "../../../controllers/v1/admin/access.controller";
import {
  checkModulePermission,
  isAuthenticatedAdmin,
} from "../../../middleware/admin/adminAuth.middleware";
import {
  CreateAccessPermissionSchema,
  UpdateAccessPermissionSchema,
} from "../../../schemas/admin/accessManage.schema";
import { GetAdminQuerySchema } from "../../../schemas/admin/adminManage.schema";
import {
  IdSchemaGet,
  IdSchemaUpdate,
} from "../../../schemas/admin/common.schema";
import { validateData } from "../../../utils/validation.utils";

const AccessManageRoute = express.Router();

AccessManageRoute.use(isAuthenticatedAdmin);

// Create access right
AccessManageRoute.post(
  "/",
  checkModulePermission(ModuleName.ACCESSMANAGEMENT, PermissionType.CREATE),
  validateData({ body: CreateAccessPermissionSchema }),
  CreateAccessPermission
);

// Get Access Permissions
AccessManageRoute.get(
  "/",
  checkModulePermission(ModuleName.ACCESSMANAGEMENT, PermissionType.VIEW),
  validateData({ query: GetAdminQuerySchema }),
  GetAccessPermissions
);

// List of Access Permissions
AccessManageRoute.get(
  "/list",
  checkModulePermission(ModuleName.ACCESSMANAGEMENT, PermissionType.VIEW),
  GetAccessPermissionList
);

// Get Access Permissions
AccessManageRoute.get(
  "/:id",
  checkModulePermission(ModuleName.ACCESSMANAGEMENT, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetAccessPermissionsById
);

// Update access by id
AccessManageRoute.put(
  "/:id",
  checkModulePermission(ModuleName.ACCESSMANAGEMENT, PermissionType.EDIT),
  validateData({ params: IdSchemaUpdate }),
  validateData({ body: UpdateAccessPermissionSchema }),
  UpdateAccessPermission
);

// Delete Access Permissions
AccessManageRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.ACCESSMANAGEMENT, PermissionType.DELETE),
  validateData({ params: IdSchemaUpdate }),
  deleteAccessPermission
);

export default AccessManageRoute;
