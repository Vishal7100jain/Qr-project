import express from "express";
import { verifyUser } from "../../../common/auth.token";
import { authRateLimit } from "../../../config/express-rate-limit.config";
import CalculationHistoryRoute from "./history.route";
import MemberAuthRoute from "./member.auth.route";

const MemberRootRoute = express.Router();

// Member Auth
MemberRootRoute.use("/auth", authRateLimit, MemberAuthRoute);

// member history calculation route
MemberRootRoute.use(
  "/chart-calculation-history",
  verifyUser,
  CalculationHistoryRoute
);

// // Member OTP router
// MemberRootRoute.use("/otp", otpRateLimit, MemberOTPRouter);

// // Member Booking route
// MemberRootRoute.use("/booking", MemberBookingRoute);

// // Blogs route
// MemberRootRoute.use("/blog", MemberBlogRoute);

// // Member Coming Soon Router
// MemberRootRoute.use("/subscribe", MemberComingSoonRouter);

export default MemberRootRoute;
