import { NextFunction, Request, Response } from "express";
import { RoleEnum } from "../../constants/enums";
import { ActivityLog } from "../../models/admin/activityLog.model";

export const adminActivityLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const ipAddress = req?.ip || req?.socket?.remoteAddress;
  const userAgent = req?.headers["user-agent"] || "";
  const url = req?.originalUrl?.split("/api/v1/admin")?.[1] || req?.originalUrl;
  const action = req?.method;

  res.on("finish", async () => {
    try {
      if (req.admin) {
        // Ensure admin is authenticated
        const module =
          req.moduleName ||
          url.split("/api/v1/admin/")[1]?.split("/")[0] ||
          "unknown";

        const logData = {
          pId: req.admin?._id,
          pRole: RoleEnum.ADMIN,
          mo: module,
          ac: action,
          des: req?.moduleDescription || `${action} action performed`,
          url,
          ipAdd: ipAddress,
          agent: userAgent,
          sC: res.statusCode,
          tiToRes: Date.now() - start,
        };

        await ActivityLog.create(logData);
      }
    } catch (error) {
      console.error("Failed to save admin activity log:", error);
      // Consider adding proper error logging here
    }
  });

  next();
};

export const memberActivityLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  const ipAddress = req?.ip || req?.socket?.remoteAddress;
  const userAgent = req?.headers["user-agent"] || "";
  const url = req?.originalUrl?.split("/api/v1")?.[1] || req?.originalUrl;
  const action = req?.method;

  res.on("finish", async () => {
    try {
      // Ensure member is authenticated
      if (req.member) {
        const module =
          req.moduleName ||
          url.split("/api/v1/")[1]?.split("/")[0] ||
          "unknown";

        const logData = {
          pId: req.member?._id,
          pRole: RoleEnum.MEMBER,
          mo: module,
          ac: action,
          des: req?.moduleDescription || `${action} action performed`,
          url,
          ipAdd: ipAddress,
          agent: userAgent,
          sC: res.statusCode,
          tiToRes: Date.now() - start,
        };

        await ActivityLog.create(logData);
      }
    } catch (error) {
      console.error("Failed to save member activity log:", error);
    }
  });

  next();
};
