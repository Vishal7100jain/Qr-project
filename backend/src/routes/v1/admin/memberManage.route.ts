import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  CreateMember,
  DeleteMember,
  GetMemberById,
  GetMembers,
  UpdateMemberById,
} from "../../../controllers/v1/admin/memberManage.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import MemberStorage from "../../../multer/member.mutler";
import {
  IdSchemaDelete,
  IdSchemaGet,
  IdSchemaUpdate,
  PageListQuerySchema,
} from "../../../schemas/admin/common.schema";
import {
  CreateMemberSchema,
  UpdateMemberSchema,
} from "../../../schemas/admin/memberManage.schema";
import { validateData } from "../../../utils/validation.utils";

const MemberManagementRoute = express.Router();

// Get all Members data
MemberManagementRoute.get(
  "/",
  checkModulePermission(ModuleName.MEMBER_MANAGEMENT, PermissionType.VIEW),
  validateData({ query: PageListQuerySchema }),
  GetMembers
);

// Create new member
MemberManagementRoute.post(
  "/",
  checkModulePermission(ModuleName.MEMBER_MANAGEMENT, PermissionType.CREATE),
  MemberStorage.single("profilePic"),
  validateData({ body: CreateMemberSchema }),
  CreateMember
);

// Get the Member details by id
MemberManagementRoute.get(
  "/:id",
  checkModulePermission(ModuleName.MEMBER_MANAGEMENT, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetMemberById
);

// Update Blog by Id
MemberManagementRoute.put(
  "/:id",
  checkModulePermission(ModuleName.MEMBER_MANAGEMENT, PermissionType.EDIT),
  MemberStorage.single("profilePic"),
  validateData({ params: IdSchemaUpdate }),
  validateData({ body: UpdateMemberSchema }),
  UpdateMemberById
);

// Delete the Member by Id (soft)
MemberManagementRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.MEMBER_MANAGEMENT, PermissionType.DELETE),
  validateData({ params: IdSchemaDelete }),
  DeleteMember
);

export default MemberManagementRoute;
