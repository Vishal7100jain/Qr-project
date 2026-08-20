import express from "express";
import { adminRateLimit } from "../config/express-rate-limit.config";
import { adminActivityLogger } from "../middleware/admin/activityLogger";
import { VerifyAdminApiKeyMiddleware } from "../middleware/admin/adminAuth.middleware";
import { VerifyMemberApiKeyMiddleware } from "../middleware/member/apiMiddleware";
import AdminRootRoute from "./v1/admin/admin.root.route";
import memberRootRoute from "./v1/member/member.root.route";

const rootRouter = express.Router();

rootRouter.use(
  "/admin",
  VerifyAdminApiKeyMiddleware,
  adminRateLimit,
  adminActivityLogger,
  AdminRootRoute
);

rootRouter.use("/", VerifyMemberApiKeyMiddleware, memberRootRoute);

export default rootRouter;
