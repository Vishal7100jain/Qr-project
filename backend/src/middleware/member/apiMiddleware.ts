import { NextFunction, Request, Response } from "express";
import { sendError, sendSuccess } from "../../common/sender.common";
import { envConfig } from "../../config/env.config";

export const PageNotFound = (req: Request, res: Response) => {
  return sendError(req, res, "Page not found", 404);
};

export const ServerisLive = (req: Request, res: Response) => {
  return sendSuccess(req, res, "Server is live");
};

export const VerifyMemberApiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  const apiSecret = req.headers["x-api-secret"];

  if (!apiKey || !apiSecret) {
    return sendError(req, res, "API key and secret are required", 401);
  }

  if (
    apiKey !== envConfig.API_KEYS.MEMBER_X_API_KEY ||
    apiSecret !== envConfig.API_KEYS.MEMBER_X_API_SECRET
  ) {
    return sendError(req, res, "Invalid API key or secret", 403);
  }

  next();
};
