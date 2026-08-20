import express from "express";

import {
  changePassword,
  GetProfile,
  updateProfile,
} from "../../../controllers/v1/admin/Profile.controller";
import {
  ChangePasswordSchema,
  UpdateProfileSchema,
} from "../../../schemas/admin/adminProfile.schema";
import { validateData } from "../../../utils/validation.utils";

const AdminProfileRoute = express.Router();

// Get Admin Profile
AdminProfileRoute.get("/", GetProfile);

AdminProfileRoute.put(
  "/",
  validateData({ body: UpdateProfileSchema }),
  updateProfile
);
AdminProfileRoute.put(
  "/change-password",
  validateData({ body: ChangePasswordSchema }),
  changePassword
);

// AdminProfileRoute.post(
//   "/upload-image",
//   upload.single("profileImage"),
//   uploadProfileImage
// );

export default AdminProfileRoute;
