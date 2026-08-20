"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRateLimit = exports.otpRateLimit = exports.authRateLimit = exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const sender_common_1 = require("../common/sender.common");
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes (time window for tracking requests)
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers (RFC 6585)
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again after 15 minutes",
    handler: (req, res, next, options) => {
        return (0, sender_common_1.sendError)(req, res, options.message, options.statusCode);
    },
    skip: (req) => {
        const trustedIPs = ["127.0.0.1", "::1"];
        return trustedIPs.includes(req.ip || "");
    },
});
exports.authRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes (time window for tracking requests)
    max: 20, // Limit each IP to 100 requests per windowMs
    handler: (req, res, next, options) => {
        return (0, sender_common_1.sendError)(req, res, options.message, options.statusCode);
    },
});
exports.otpRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes (time window for tracking requests)
    max: 10, // Limit each IP to 100 requests per windowMs
    handler: (req, res, next, options) => {
        return (0, sender_common_1.sendError)(req, res, options.message, options.statusCode);
    },
});
exports.adminRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later",
    handler: (req, res) => {
        (0, sender_common_1.sendError)(req, res, "Too many requests, please try again later", 429);
    },
    skip: (req) => {
        var _a;
        // Skip rate limiting for super admins
        // @ts-ignore
        return ((_a = req.admin) === null || _a === void 0 ? void 0 : _a.role) === "super_admin";
    },
});
