"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const planFAQ_controller_1 = require("../../../controllers/v1/admin/planFAQ.controller");
const planFaq_schema_1 = require("../../../schemas/admin/planFaq.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
// Plan FAQs Routes
const PlanFAQManagementRoute = express_1.default.Router();
// Create Plan FAQ
PlanFAQManagementRoute.post("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFAQ, permissions_constants_1.PermissionType.CREATE), (0, validation_utils_1.validateData)({ body: planFaq_schema_1.CreatePlanFAQSchema }), planFAQ_controller_1.CreatePlanFAQ);
// Get Plan Faq list table
PlanFAQManagementRoute.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFAQ, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ query: common_schema_1.PageListQuerySchema }), planFAQ_controller_1.GetPlanFAQs);
// get plans faq by id route
PlanFAQManagementRoute.get("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFAQ, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaGet }), planFAQ_controller_1.GetPlanFaqById);
// Update Plan Faq By Id
PlanFAQManagementRoute.put("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFAQ, permissions_constants_1.PermissionType.EDIT), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaUpdate }), (0, validation_utils_1.validateData)({ body: planFaq_schema_1.UpdatePlanFAQSchema }), planFAQ_controller_1.UpdatePlanFAQ);
PlanFAQManagementRoute.delete("/:id", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.PLANFAQ, permissions_constants_1.PermissionType.DELETE), (0, validation_utils_1.validateData)({ params: common_schema_1.IdSchemaDelete }), planFAQ_controller_1.DeletePlanFAQ);
exports.default = PlanFAQManagementRoute;
