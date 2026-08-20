import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { CommonErrorMessage } from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import Admin from "../../../models/admin/admin.model";
import { comparePassword, hashPassword } from "../../../utils/password.utils";
import { handleAdminResponse } from "./adminAuth.controller";

export const GetProfile = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PROFILE;

  try {
    const id = req.admin._id!;
    const admin = await Admin.findById(id, "roleId username email _id")
      .populate({
        path: "roleId",
        options: { lean: true },
      })
      .lean();

    if (!admin) {
      return sendError(req, res, CommonErrorMessage.admin.management.notFound);
    }

    sendSuccess(
      req,
      res,
      handleAdminResponse(admin, ""),
      "Profile retrieved successfully"
    );
  } catch (error: any) {
    sendError(req, res, error?.message || "Failed to fetch profile", 500);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PROFILE;
  try {
    const adminId = req.admin!._id;
    const updateData = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedAdmin) {
      return sendError(req, res, "Admin not found", 404);
    }

    sendSuccess(req, res, updatedAdmin, "Profile updated successfully");
  } catch (error: any) {
    sendError(req, res, error?.message || "Failed to update profile", 500);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PROFILE;
  try {
    const adminId = req.admin!._id;
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return sendError(req, res, "Admin not found", 404);
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return sendError(req, res, "Current password is incorrect", 400);
    }

    // Update password
    admin.password = await hashPassword(newPassword);
    await admin.save();

    sendSuccess(req, res, null, "Password changed successfully");
  } catch (error: any) {
    sendError(req, res, error?.message || "Failed to change password", 500);
  }
};
