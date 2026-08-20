"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_controller_1 = require("../../../controllers/v1/admin/adminAuth.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const adminAuth_schema_1 = require("../../../schemas/admin/adminAuth.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const AdminAuthRoute = express_1.default.Router();
AdminAuthRoute.post("/login", (0, validation_utils_1.validateData)({ body: adminAuth_schema_1.AdminLoginSchema }), adminAuth_controller_1.AdminLogin);
AdminAuthRoute.post("/logout", adminAuth_middleware_1.isAuthenticatedAdmin, adminAuth_controller_1.LogoutAdmin);
exports.default = AdminAuthRoute;
