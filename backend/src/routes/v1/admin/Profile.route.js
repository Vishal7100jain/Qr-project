"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Profile_controller_1 = require("../../../controllers/v1/admin/Profile.controller");
const adminProfile_schema_1 = require("../../../schemas/admin/adminProfile.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const AdminProfileRoute = express_1.default.Router();
// Get Admin Profile
AdminProfileRoute.get("/", Profile_controller_1.GetProfile);
AdminProfileRoute.put("/", (0, validation_utils_1.validateData)({ body: adminProfile_schema_1.UpdateProfileSchema }), Profile_controller_1.updateProfile);
AdminProfileRoute.put("/change-password", (0, validation_utils_1.validateData)({ body: adminProfile_schema_1.ChangePasswordSchema }), Profile_controller_1.changePassword);
// AdminProfileRoute.post(
//   "/upload-image",
//   upload.single("profileImage"),
//   uploadProfileImage
// );
exports.default = AdminProfileRoute;
