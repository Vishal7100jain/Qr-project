import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  GetAdminActivityHistory,
  GetAdminLoginHistory,
} from "../../../controllers/v1/admin/history.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import { PageListQuerySchema } from "../../../schemas/admin/common.schema";
import { validateData } from "../../../utils/validation.utils";

const HistoryManageRoute = express.Router();

// Get Admin Login History
HistoryManageRoute.get(
  "/login",
  checkModulePermission(ModuleName.ADMIN_LOGIN_HISTORY, PermissionType.VIEW),
  validateData({ params: PageListQuerySchema }),
  GetAdminLoginHistory
);

// Get Admin Activity history
HistoryManageRoute.get(
  "/activity",
  checkModulePermission(ModuleName.ADMIN_ACTIVITY_HISTORY, PermissionType.VIEW),
  validateData({ params: PageListQuerySchema }),
  GetAdminActivityHistory
);

export default HistoryManageRoute;
