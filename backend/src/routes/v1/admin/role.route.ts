import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  CreateRole,
  DeleteRole,
  GetRoleById,
  GetRoleList,
  GetRoles,
  UpdateRole,
} from "../../../controllers/v1/admin/role.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import { IdSchemaGet } from "../../../schemas/admin/common.schema";
import {
  CreateRoleSchema,
  GetRoleQuerySchema,
  ParamsMongosId,
  UpdateRoleSchema,
} from "../../../schemas/admin/roleManage.schema";
import { validateData } from "../../../utils/validation.utils";

const RoleManageRoute = express.Router();

// Get all role data for role management
RoleManageRoute.get(
  "/",
  checkModulePermission(ModuleName.ROLEMANAGEMENT, PermissionType.VIEW),
  validateData({ query: GetRoleQuerySchema }),
  GetRoles
);

// Get Role list for dropdown
RoleManageRoute.get(
  "/list",
  checkModulePermission(ModuleName.ROLEMANAGEMENT, PermissionType.VIEW),
  GetRoleList
);

// Create new Role
RoleManageRoute.post(
  "/",
  checkModulePermission(ModuleName.ROLEMANAGEMENT, PermissionType.CREATE),
  validateData({ body: CreateRoleSchema }),
  CreateRole
);

// Get the role by id
RoleManageRoute.get(
  "/:id",
  checkModulePermission(ModuleName.ROLEMANAGEMENT, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetRoleById
);

// Update the role
RoleManageRoute.put(
  "/:id",
  checkModulePermission(ModuleName.ROLEMANAGEMENT, PermissionType.EDIT),
  validateData({ params: ParamsMongosId }),
  validateData({ body: UpdateRoleSchema }),
  UpdateRole
);

// Delete the role
RoleManageRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.ROLEMANAGEMENT, PermissionType.DELETE),
  validateData({ params: ParamsMongosId }),
  DeleteRole
);

export default RoleManageRoute;
