"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const plan_controller_1 = require("../../../controllers/v1/admin/plan.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const planManage_schema_1 = require("../../../schemas/admin/planManage.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const PlanManagementRoute = express_1.default.Router();
// create new plan route
PlanManagementRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANS, permissions_constants_1.PermissionType.CREATE), (0, validation_utils_1.validateData)({ body: planManage_schema_1.CreatePlanSchema }), plan_controller_1.CreatePlan);
// get plans route
PlanManagementRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANS, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: planManage_schema_1.GetPlanQuerySchema }), plan_controller_1.GetPlans);
// get list of plans route
PlanManagementRoute.get("/list", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANS, permissions_constants_1.PermissionType.VIEW), plan_controller_1.GetPlansList);
// get plans route
PlanManagementRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANS, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), plan_controller_1.GetPlanById);
// Update plan route
PlanManagementRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANS, permissions_constants_1.PermissionType.EDIT), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), (0, validation_utils_1.validateData)({ body: planManage_schema_1.UpdatePlanSchema }), plan_controller_1.UpdatePlan);
// Delete plan route
PlanManagementRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANS, permissions_constants_1.PermissionType.DELETE), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaDelete }), plan_controller_1.DeletePlan);
exports.default = PlanManagementRoute;
