import express from "express";
import {
  isAuthenticatedAdmin,
  isSuperAdmin,
} from "../../../middleware/admin/adminAuth.middleware";
import { PageNotFound } from "../../../middleware/member/apiMiddleware";
import AccessManageRoute from "./access.route";
import BookingManagement from "./adminBooking.route";
import ComminSoonManagment from "./adminCommingSoon.route";
import AdminManageRoute from "./adminManage.route";
import AdminAuthRoute from "./Auth.route";
import BlogRoute from "./blog.route";
import BlogCategoryRoute from "./blogCategory.route";
import HistoryManageRoute from "./history.route";
import MemberHistoryManagment from "./memberHistory.route";
import MemberManagementRoute from "./memberManage.route";
import PlanFAQManagementRoute from "./planFaq.route";
import PlanFeatureManagementRoute from "./planFeature.route";
import PlanManagementRoute from "./plans.route";
import AdminProfileRoute from "./Profile.route";
import RoleManageRoute from "./role.route";

const AdminRootRoute = express.Router();

// Authentication routes
AdminRootRoute.use("/auth", AdminAuthRoute);

// The admin must be authenticated to access below routes
AdminRootRoute.use(isAuthenticatedAdmin);

// Admin management (super admin only)
AdminRootRoute.use(
  "/manage",

  isSuperAdmin,
  AdminManageRoute
);

// Access management
AdminRootRoute.use(
  "/access",

  isSuperAdmin,
  AccessManageRoute
);

// Role management
AdminRootRoute.use(
  "/roles",

  isSuperAdmin,
  RoleManageRoute
);

// Blog Category Managment
AdminRootRoute.use("/blog-category", BlogCategoryRoute);

// Blog Managment
AdminRootRoute.use("/blog", BlogRoute);

// Admin History Routes
AdminRootRoute.use("/history", HistoryManageRoute);

// Member Management Routes
AdminRootRoute.use("/member", MemberManagementRoute);

// Member History Management
AdminRootRoute.use(
  "/member-history",

  MemberHistoryManagment
);

// Booking Order Management
AdminRootRoute.use(
  "/booking-management",

  BookingManagement
);

// Cooming Soon Management
AdminRootRoute.use("/comming-soon", ComminSoonManagment);

// Plan Management
AdminRootRoute.use("/plans", PlanManagementRoute);

// Plans feature Management
AdminRootRoute.use(
  "/plan-feature",

  PlanFeatureManagementRoute
);

// Plans FAQ Management
AdminRootRoute.use("/plan-faq", PlanFAQManagementRoute);

// Profile management (pending)
AdminRootRoute.use("/profile", AdminProfileRoute);

AdminRootRoute.use(PageNotFound);

export default AdminRootRoute;
