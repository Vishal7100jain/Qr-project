"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_token_1 = require("../../../common/auth.token");
const express_rate_limit_config_1 = require("../../../config/express-rate-limit.config");
const history_route_1 = __importDefault(require("./history.route"));
const member_auth_route_1 = __importDefault(require("./member.auth.route"));
const MemberRootRoute = express_1.default.Router();
// Member Auth
MemberRootRoute.use("/auth", express_rate_limit_config_1.authRateLimit, member_auth_route_1.default);
// member history calculation route
MemberRootRoute.use("/chart-calculation-history", auth_token_1.verifyUser, history_route_1.default);
// // Member OTP router
// MemberRootRoute.use("/otp", otpRateLimit, MemberOTPRouter);
// // Member Booking route
// MemberRootRoute.use("/booking", MemberBookingRoute);
// // Blogs route
// MemberRootRoute.use("/blog", MemberBlogRoute);
// // Member Coming Soon Router
// MemberRootRoute.use("/subscribe", MemberComingSoonRouter);
exports.default = MemberRootRoute;
