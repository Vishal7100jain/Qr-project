import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  CreatePlan,
  DeletePlan,
  GetPlanById,
  GetPlans,
  GetPlansList,
  UpdatePlan,
} from "../../../controllers/v1/admin/plan.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import {
  IdSchemaDelete,
  IdSchemaGet,
  IdSchemaUpdate,
} from "../../../schemas/admin/common.schema";
import {
  CreatePlanSchema,
  GetPlanQuerySchema,
  UpdatePlanSchema,
} from "../../../schemas/admin/planManage.schema";
import { validateData } from "../../../utils/validation.utils";

const PlanManagementRoute = express.Router();

// create new plan route
PlanManagementRoute.post(
  "/",
  checkModulePermission(ModuleName.PLANS, PermissionType.CREATE),
  validateData({ body: CreatePlanSchema }),
  CreatePlan
);

// get plans route
PlanManagementRoute.get(
  "/",
  checkModulePermission(ModuleName.PLANS, PermissionType.VIEW),
  validateData({ query: GetPlanQuerySchema }),
  GetPlans
);

// get list of plans route
PlanManagementRoute.get(
  "/list",
  checkModulePermission(ModuleName.PLANS, PermissionType.VIEW),
  GetPlansList
);

// get plans route
PlanManagementRoute.get(
  "/:id",
  checkModulePermission(ModuleName.PLANS, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetPlanById
);

// Update plan route
PlanManagementRoute.put(
  "/:id",
  checkModulePermission(ModuleName.PLANS, PermissionType.EDIT),
  validateData({ params: IdSchemaUpdate }),
  validateData({ body: UpdatePlanSchema }),
  UpdatePlan
);

// Delete plan route
PlanManagementRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.PLANS, PermissionType.DELETE),
  validateData({ params: IdSchemaDelete }),
  DeletePlan
);

export default PlanManagementRoute;
