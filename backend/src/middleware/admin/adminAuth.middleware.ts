import { NextFunction, Request, Response } from "express";
import { verifyTokenAdmin } from "../../common/admin/admin.token";
import { sendError } from "../../common/sender.common";
import { envConfig } from "../../config/env.config";
import { AdminStatus, PersonTypeEnum } from "../../constants/admin.enums";
import {
  ADMIN_ROLES,
  ModuleName,
  PermissionType,
  generatePermissionString,
} from "../../constants/permissions.constants";
import Admin from "../../models/admin/admin.model";
import LoginHistory from "../../models/admin/loginHistory.model";
import { IMember } from "../../models/member/member.model";

declare global {
  namespace Express {
    interface Request {
      admin?: any;
      moduleName?: ModuleName;
      action?: PermissionType;
      moduleDescription?: String;
      member?: IMember;
    }
  }
}

export const isAuthenticatedAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if token exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendError(req, res, "Authorization header is missing", 403);
    }

    // 2. Extract token from header
    const token = authHeader.split(" ")[1];
    if (!token) {
      return sendError(req, res, "Authentication token is required", 403);
    }

    // 3. Verify token
    let decoded: any;
    try {
      decoded = verifyTokenAdmin(token);
    } catch (jwtError) {
      return sendError(
        req,
        res,
        (jwtError as Error).message ||
          "Invalid or expired authentication token",
        406
      );
    }

    // 4. Find admin in database
    const admin = await Admin.findById(decoded?.user?._id)
      .select("-password")
      .populate("roleId");

    if (!admin) {
      return sendError(req, res, "Admin account not found", 404);
    }

    // new step to verify is admin session is active.
    const isAdminSessionActive = await LoginHistory.findOne({
      personId: admin?._id,
      personType: PersonTypeEnum.ADMIN,
      isActive: AdminStatus.ACTIVE,
    });

    // checking the admin logout time correct or not
    if (
      !isAdminSessionActive ||
      isAdminSessionActive.isActive === AdminStatus.INACTIVE ||
      (isAdminSessionActive?.logoutAt &&
        new Date(isAdminSessionActive?.logoutAt) <= new Date())
    ) {
      // updating admin login status to inactive when logout time is set and is true
      if (isAdminSessionActive?.isActive === AdminStatus.ACTIVE) {
        isAdminSessionActive.isActive = AdminStatus.INACTIVE;
        await isAdminSessionActive.save();
      }

      return sendError(
        req,
        res,
        "Your admin session has expired or is no longer active.",
        403
      );
    }

    // 5. Check admin status
    if (admin.status != AdminStatus.ACTIVE) {
      return sendError(
        req,
        res,
        "Admin account is not active. Please contact support.",
        403
      );
    }

    // 6. Attach admin to request and proceed
    req.admin = admin;
    next();
  } catch (error: any) {
    console.error("Admin authentication error:", error);
    sendError(
      req,
      res,
      error?.message || "An error occurred during authentication",
      500
    );
  }
};

export const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req?.admin?.roleId?.name === ADMIN_ROLES.SUPER_ADMIN ||
    req.method === "GET"
  )
    return next();
  return sendError(
    req,
    res,
    "This module is restricted to super administrators only.",
    403
  );
};

export const checkModulePermission = (
  module: ModuleName,
  action: PermissionType
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = req.admin!;

    // Super admin bypasses all checks
    if (admin?.roleId?.name === ADMIN_ROLES.SUPER_ADMIN) {
      req.moduleName = module;
      req.action = action;
      return next();
    }

    // Check if admin has permission for this module and action
    const modulePermission =
      admin?.roleId?.access?.find((p: any) => p.module === module) || false;

    if (!modulePermission || !modulePermission.permissions.includes(action)) {
      return sendError(
        req,
        res,
        `Insufficient permissions: ${generatePermissionString(
          module,
          action
        )} required`,
        403
      );
    }

    // Add context to request
    req.moduleName = module;
    req.action = action;

    next();
  };
};

export const VerifyAdminApiKeyMiddleware = (
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
    envConfig.API_KEYS.ADMIN_X_API_KEY != apiKey ||
    envConfig.API_KEYS.ADMIN_X_API_SECRET != apiSecret
  ) {
    return sendError(req, res, "Invalid API key or secret", 403);
  }

  next();
};
