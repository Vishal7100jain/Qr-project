import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import { GetCommingSoonSubscriber } from "../../../controllers/v1/admin/adminCommingSoon.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import { PageListQuerySchema } from "../../../schemas/admin/common.schema";
import { validateData } from "../../../utils/validation.utils";

const ComminSoonManagment = express.Router();

// Get Bookings
ComminSoonManagment.get(
  "/",
  checkModulePermission(
    ModuleName.COMMING_SOON_MANAGEMENT,
    PermissionType.VIEW
  ),
  validateData({ params: PageListQuerySchema }),
  GetCommingSoonSubscriber
);

export default ComminSoonManagment;
