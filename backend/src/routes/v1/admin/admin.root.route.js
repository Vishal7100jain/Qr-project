"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuth_middleware_1 = require("../../../middleware/admin/adminAuth.middleware");
const apiMiddleware_1 = require("../../../middleware/member/apiMiddleware");
const access_route_1 = __importDefault(require("./access.route"));
const adminBooking_route_1 = __importDefault(require("./adminBooking.route"));
const adminCommingSoon_route_1 = __importDefault(require("./adminCommingSoon.route"));
const adminManage_route_1 = __importDefault(require("./adminManage.route"));
const Auth_route_1 = __importDefault(require("./Auth.route"));
const blog_route_1 = __importDefault(require("./blog.route"));
const blogCategory_route_1 = __importDefault(require("./blogCategory.route"));
const history_route_1 = __importDefault(require("./history.route"));
const memberHistory_route_1 = __importDefault(require("./memberHistory.route"));
const memberManage_route_1 = __importDefault(require("./memberManage.route"));
const planFaq_route_1 = __importDefault(require("./planFaq.route"));
const planFeature_route_1 = __importDefault(require("./planFeature.route"));
const plans_route_1 = __importDefault(require("./plans.route"));
const Profile_route_1 = __importDefault(require("./Profile.route"));
const role_route_1 = __importDefault(require("./role.route"));
const AdminRootRoute = express_1.default.Router();
// Authentication routes
AdminRootRoute.use("/auth", Auth_route_1.default);
// The admin must be authenticated to access below routes
AdminRootRoute.use(adminAuth_middleware_1.isAuthenticatedAdmin);
// Admin management (super admin only)
AdminRootRoute.use("/manage", adminAuth_middleware_1.isSuperAdmin, adminManage_route_1.default);
// Access management
AdminRootRoute.use("/access", adminAuth_middleware_1.isSuperAdmin, access_route_1.default);
// Role management
AdminRootRoute.use("/roles", adminAuth_middleware_1.isSuperAdmin, role_route_1.default);
// Blog Category Managment
AdminRootRoute.use("/blog-category", blogCategory_route_1.default);
// Blog Managment
AdminRootRoute.use("/blog", blog_route_1.default);
// Admin History Routes
AdminRootRoute.use("/history", history_route_1.default);
// Member Management Routes
AdminRootRoute.use("/member", memberManage_route_1.default);
// Member History Management
AdminRootRoute.use("/member-history", memberHistory_route_1.default);
// Booking Order Management
AdminRootRoute.use("/booking-management", adminBooking_route_1.default);
// Cooming Soon Management
AdminRootRoute.use("/comming-soon", adminCommingSoon_route_1.default);
// Plan Management
AdminRootRoute.use("/plans", plans_route_1.default);
// Plans feature Management
AdminRootRoute.use("/plan-feature", planFeature_route_1.default);
// Plans FAQ Management
AdminRootRoute.use("/plan-faq", planFaq_route_1.default);
// Profile management (pending)
AdminRootRoute.use("/profile", Profile_route_1.default);
AdminRootRoute.use(apiMiddleware_1.PageNotFound);
exports.default = AdminRootRoute;
