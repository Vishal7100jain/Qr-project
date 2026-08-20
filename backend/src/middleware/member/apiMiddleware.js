"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyMemberApiKeyMiddleware = exports.ServerisLive = exports.PageNotFound = void 0;
const sender_common_1 = require("../../common/sender.common");
const env_config_1 = require("../../config/env.config");
const PageNotFound = (req, res) => {
    return (0, sender_common_1.sendError)(req, res, "Page not found", 404);
};
exports.PageNotFound = PageNotFound;
const ServerisLive = (req, res) => {
    return (0, sender_common_1.sendSuccess)(req, res, "Server is live");
};
exports.ServerisLive = ServerisLive;
const VerifyMemberApiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    const apiSecret = req.headers["x-api-secret"];
    if (!apiKey || !apiSecret) {
        return (0, sender_common_1.sendError)(req, res, "API key and secret are required", 401);
    }
    if (apiKey !== env_config_1.envConfig.API_KEYS.MEMBER_X_API_KEY ||
        apiSecret !== env_config_1.envConfig.API_KEYS.MEMBER_X_API_SECRET) {
        return (0, sender_common_1.sendError)(req, res, "Invalid API key or secret", 403);
    }
    next();
};
exports.VerifyMemberApiKeyMiddleware = VerifyMemberApiKeyMiddleware;
