"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// planManagement.route.ts
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const planFeature_controller_1 = require("../../../controllers/v1/admin/planFeature.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const planFeature_schema_1 = require("../../../schemas/admin/planFeature.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const PlanFeatureManagementRoute = express_1.default.Router();
// Plan Features Create Route
PlanFeatureManagementRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFEATURE, permissions_constants_1.PermissionType.CREATE), (0, validation_utils_1.validateData)({ body: planFeature_schema_1.CreatePlanFeatureSchema }), planFeature_controller_1.CreatePlanFeature);
// Plan Features Get List Route
PlanFeatureManagementRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFEATURE, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: planFeature_schema_1.GetPlanFeaturesQuerySchema }), planFeature_controller_1.GetPlanFeatures);
// get plans feature by id route
PlanFeatureManagementRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFEATURE, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), planFeature_controller_1.GetPlanFeatureById);
// Plan Features Update Route
PlanFeatureManagementRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFEATURE, permissions_constants_1.PermissionType.EDIT), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), (0, validation_utils_1.validateData)({ body: planFeature_schema_1.UpdatePlanFeatureSchema }), planFeature_controller_1.UpdatePlanFeature);
// Plan Features Delete Route
PlanFeatureManagementRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFEATURE, permissions_constants_1.PermissionType.DELETE), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaDelete }), planFeature_controller_1.DeletePlanFeature);
exports.default = PlanFeatureManagementRoute;
