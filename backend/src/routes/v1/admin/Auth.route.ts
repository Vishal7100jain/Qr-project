import express from "express";
import {
  AdminLogin,
  LogoutAdmin,
} from "../../../controllers/v1/admin/adminAuth.controller";
import { isAuthenticatedAdmin } from "../../../middleware/admin/adminAuth.middleware";
import { AdminLoginSchema } from "../../../schemas/admin/adminAuth.schema";
import { validateData } from "../../../utils/validation.utils";

const AdminAuthRoute = express.Router();

AdminAuthRoute.post(
  "/login",
  validateData({ body: AdminLoginSchema }),
  AdminLogin
);

AdminAuthRoute.post("/logout", isAuthenticatedAdmin, LogoutAdmin);

export default AdminAuthRoute;
