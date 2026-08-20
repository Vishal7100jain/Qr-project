// planManagement.route.ts
import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import {
  CreatePlanFeature,
  DeletePlanFeature,
  GetPlanFeatureById,
  GetPlanFeatures,
  UpdatePlanFeature,
} from "../../../controllers/v1/admin/planFeature.controller";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import {
  IdSchemaDelete,
  IdSchemaGet,
  IdSchemaUpdate,
} from "../../../schemas/admin/common.schema";
import {
  CreatePlanFeatureSchema,
  GetPlanFeaturesQuerySchema,
  UpdatePlanFeatureSchema,
} from "../../../schemas/admin/planFeature.schema";
import { validateData } from "../../../utils/validation.utils";

const PlanFeatureManagementRoute = express.Router();

// Plan Features Create Route
PlanFeatureManagementRoute.post(
  "/",
  checkModulePermission(ModuleName.PLANFEATURE, PermissionType.CREATE),
  validateData({ body: CreatePlanFeatureSchema }),
  CreatePlanFeature
);

// Plan Features Get List Route
PlanFeatureManagementRoute.get(
  "/",
  checkModulePermission(ModuleName.PLANFEATURE, PermissionType.VIEW),
  validateData({ query: GetPlanFeaturesQuerySchema }),
  GetPlanFeatures
);

// get plans feature by id route
PlanFeatureManagementRoute.get(
  "/:id",
  checkModulePermission(ModuleName.PLANFEATURE, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetPlanFeatureById
);

// Plan Features Update Route
PlanFeatureManagementRoute.put(
  "/:id",
  checkModulePermission(ModuleName.PLANFEATURE, PermissionType.EDIT),
  validateData({ params: IdSchemaUpdate }),
  validateData({ body: UpdatePlanFeatureSchema }),
  UpdatePlanFeature
);

// Plan Features Delete Route
PlanFeatureManagementRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.PLANFEATURE, PermissionType.DELETE),
  validateData({ params: IdSchemaDelete }),
  DeletePlanFeature
);

export default PlanFeatureManagementRoute;
