import { Request, Response } from "express";
import { generateTokenAdmin } from "../../../common/admin/admin.token";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { envConfig } from "../../../config/env.config";
import { AdminStatus, PersonTypeEnum } from "../../../constants/admin.enums";
import { CommonErrorMessage } from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import Admin, { IAdmin } from "../../../models/admin/admin.model";
import LoginHistory from "../../../models/admin/loginHistory.model";
import {
  createLoginHistory,
  updateLoginHistoryToLogout,
} from "../../../utils/loginHistory.utils";
import { comparePassword } from "../../../utils/password.utils";

export const handleAdminResponse = (data: IAdmin | any, token: string) => {
  return {
    username: data?.username,
    email: data?.email,
    role: data?.roleId,
    _id: data?._id,
    token,
  };
};

export const AdminLogin = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ADMIN;

  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).populate("roleId").lean();
    if (!admin)
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.auth.invalidCredentails,
        401
      );

    if (admin?.isDeleted) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.auth.accountDeleted,
        401
      );
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch)
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.auth.invalidCredentails,
        401
      );

    if (admin.status != AdminStatus.ACTIVE) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.auth.accountInActive,
        401
      );
    }

    // logout the other token and device
    await updateLoginHistoryToLogout({ personIds: String(admin?._id) });

    // Generate Tokens
    const token = generateTokenAdmin({ _id: admin?._id, email: admin?.email });

    await createLoginHistory({
      personId: String(admin?._id),
      personType: PersonTypeEnum.ADMIN,
      ipAddress: req?.ip,
      userAgent: req.get("User-Agent"),
      logoutAt: new Date(Date.now() + envConfig.ADMIN_LOGOUT_TIME_SECOND),
    });

    return sendSuccess(
      req,
      res,
      handleAdminResponse(admin, token),
      `Welcome back, ${admin?.username}!`
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.auth.loginFailed,
      500,
      error
    );
  }
};

export const LogoutAdmin = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ADMIN;
  try {
    const id = req.admin?.id;
    const updatedLoginHistory = await LoginHistory.findOneAndUpdate(
      { personId: id },
      { $set: { logoutAt: new Date() } }
    );

    if (!updatedLoginHistory) {
      console.log("logout api failed");
    }

    return sendSuccess(req, res, {}, "Logged out");
  } catch (error: any) {
    sendError(req, res, error?.message || "Logout failed", 500, error);
  }
};
