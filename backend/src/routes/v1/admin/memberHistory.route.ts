import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  GetMemberActivityHistory,
  GetMemberLoginHistory,
} from "../../../controllers/v1/admin/history.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import { PageListQuerySchema } from "../../../schemas/admin/common.schema";
import { validateData } from "../../../utils/validation.utils";

const MemberHistoryManagment = express.Router();

// Get Member Login History
MemberHistoryManagment.get(
  "/login",
  checkModulePermission(ModuleName.MEMBER_LOGIN_HISTORY, PermissionType.VIEW),
  validateData({ params: PageListQuerySchema }),
  GetMemberLoginHistory
);

// Get Member Activity history
MemberHistoryManagment.get(
  "/activity",
  checkModulePermission(
    ModuleName.MEMBER_ACTIVITY_HISTORY,
    PermissionType.VIEW
  ),
  validateData({ params: PageListQuerySchema }),
  GetMemberActivityHistory
);

export default MemberHistoryManagment;
