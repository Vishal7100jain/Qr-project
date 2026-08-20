"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_constants_1 = require("../../../constants/permissions.constants");
const adminCommingSoon_controller_1 = require("../../../controllers/v1/admin/adminCommingSoon.controller");
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const common_schema_1 = require("../../../schemas/admin/common.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const ComminSoonManagment = express_1.default.Router();
// Get Bookings
ComminSoonManagment.get("/", (0, adminAuth_middleware_1.checkModulePermission)(permissions_constants_1.ModuleName.COMMING_SOON_MANAGEMENT, permissions_constants_1.PermissionType.VIEW), (0, validation_utils_1.validateData)({ params: common_schema_1.PageListQuerySchema }), adminCommingSoon_controller_1.GetCommingSoonSubscriber);
exports.default = ComminSoonManagment;
