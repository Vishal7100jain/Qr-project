import { Request } from "express";
import rateLimit from "express-rate-limit";
import { sendError } from "../common/sender.common";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (time window for tracking requests)
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers (RFC 6585)
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res, next, options) => {
    return sendError(req, res, options.message, options.statusCode);
  },
  skip: (req: Request) => {
    const trustedIPs = ["127.0.0.1", "::1"];
    return trustedIPs.includes(req.ip || "");
  },
});

export const authRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes (time window for tracking requests)
  max: 20, // Limit each IP to 100 requests per windowMs
  handler: (req, res, next, options) => {
    return sendError(req, res, options.message, options.statusCode);
  },
});

export const otpRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes (time window for tracking requests)
  max: 10, // Limit each IP to 100 requests per windowMs
  handler: (req, res, next, options) => {
    return sendError(req, res, options.message, options.statusCode);
  },
});

export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later",
  handler: (req, res) => {
    sendError(req, res, "Too many requests, please try again later", 429);
  },
  skip: (req) => {
    // Skip rate limiting for super admins
    // @ts-ignore
    return req.admin?.role === "super_admin";
  },
});
