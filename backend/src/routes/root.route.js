"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_config_1 = require("../config/express-rate-limit.config");
const activityLogger_1 = require("../middleware/admin/activityLogger");
const adminAuth_middleware_1 = require("../middleware/admin/adminAuth.middleware");
const apiMiddleware_1 = require("../middleware/member/apiMiddleware");
const admin_root_route_1 = __importDefault(require("./v1/admin/admin.root.route"));
const member_root_route_1 = __importDefault(require("./v1/member/member.root.route"));
const rootRouter = express_1.default.Router();
rootRouter.use("/admin", adminAuth_middleware_1.VerifyAdminApiKeyMiddleware, express_rate_limit_config_1.adminRateLimit, activityLogger_1.adminActivityLogger, admin_root_route_1.default);
rootRouter.use("/", apiMiddleware_1.VerifyMemberApiKeyMiddleware, member_root_route_1.default);
exports.default = rootRouter;
