import express from "express";
import {
  ModuleName,
  PermissionType,
} from "../../../constants/permissions.constants";
import { checkModulePermission } from "../../../middleware/admin/adminAuth.middleware";
import {
  IdSchemaDelete,
  IdSchemaGet,
  IdSchemaUpdate,
  PageListQuerySchema,
} from "../../../schemas/admin/common.schema";

import {
  CreatePlanFAQ,
  DeletePlanFAQ,
  GetPlanFaqById,
  GetPlanFAQs,
  UpdatePlanFAQ,
} from "../../../controllers/v1/admin/planFAQ.controller";
import {
  CreatePlanFAQSchema,
  UpdatePlanFAQSchema,
} from "../../../schemas/admin/planFaq.schema";
import { validateData } from "../../../utils/validation.utils";

// Plan FAQs Routes
const PlanFAQManagementRoute = express.Router();

// Create Plan FAQ
PlanFAQManagementRoute.post(
  "/",
  checkModulePermission(ModuleName.PLANFAQ, PermissionType.CREATE),
  validateData({ body: CreatePlanFAQSchema }),
  CreatePlanFAQ
);

// Get Plan Faq list table
PlanFAQManagementRoute.get(
  "/",
  checkModulePermission(ModuleName.PLANFAQ, PermissionType.VIEW),
  validateData({ query: PageListQuerySchema }),
  GetPlanFAQs
);

// get plans faq by id route
PlanFAQManagementRoute.get(
  "/:id",
  checkModulePermission(ModuleName.PLANFAQ, PermissionType.VIEW),
  validateData({ params: IdSchemaGet }),
  GetPlanFaqById
);

// Update Plan Faq By Id
PlanFAQManagementRoute.put(
  "/:id",
  checkModulePermission(ModuleName.PLANFAQ, PermissionType.EDIT),
  validateData({ params: IdSchemaUpdate }),
  validateData({ body: UpdatePlanFAQSchema }),
  UpdatePlanFAQ
);

PlanFAQManagementRoute.delete(
  "/:id",
  checkModulePermission(ModuleName.PLANFAQ, PermissionType.DELETE),
  validateData({ params: IdSchemaDelete }),
  DeletePlanFAQ
);

export default PlanFAQManagementRoute;
