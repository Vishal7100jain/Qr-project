import { Request, Response } from "express";
import path from "path";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { AdminStatus, DeletedEnum } from "../../../constants/admin.enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import Admin from "../../../models/admin/admin.model";
import Role from "../../../models/admin/role.model";
import { deleteFile } from "../../../multer/deleteFile";
import { updateLoginHistoryToLogout } from "../../../utils/loginHistory.utils";
import { comparePassword, hashPassword } from "../../../utils/password.utils";

// Create new Admin
export const CreateAdmin = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ADMINMANAGEMENT;
  try {
    const adminId = req.admin?._id;
    const { username, email, password, roleId, status, contactNumber } =
      req.body;
    req.moduleDescription = `Created new admin: ${username}`;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      deleteFile(req.file?.path);
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.alreadyExists,
        400
      );
    }

    const findRole = await Role.findOne({ _id: roleId });
    if (!findRole) {
      deleteFile(req.file?.path);
      return sendError(req, res, CommonErrorMessage.admin.role.notFound, 400);
    }

    // Create new admin
    const hashedPassword = await hashPassword(password);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      contactNumber,
      roleId,
      status: status,
      createdBy: adminId,
      modifiedBy: adminId,
    });

    if (req.file?.filename) {
      const fileName = req.file?.filename;
      newAdmin.profileImage = `/admin-profile/${fileName}`;
    }

    await newAdmin.save();

    const { password: _, ...adminData } = newAdmin.toObject();
    sendSuccess(
      req,
      res,
      adminData,
      CommonSuccessMessage.admin.adminManagement.adminCreated,
      201
    );
  } catch (error: any) {
    deleteFile(req.file?.path);
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.management.creationFailed,
      500,
      error
    );
  }
};

// Get Admin list
export const GetAdmins = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ADMINMANAGEMENT;
  try {
    const { page = 1, pageSize = 10, search = "", status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const adminEmail = req.admin?.email;
    const filter: any = {
      email: { $ne: adminEmail },
    };

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== undefined && status !== null) {
      filter.status = { $eq: Number(status) };
    }

    const result = await Admin.aggregate([
      { $match: { ...filter, isDeleted: DeletedEnum.NOT_DELETED } },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
            {
              $lookup: {
                from: "roles",
                localField: "roleId",
                foreignField: "_id",
                as: "role",
              },
            },
            { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: "admins",
                localField: "createdBy",
                foreignField: "_id",
                as: "creator",
              },
            },
            { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: "admins",
                localField: "modifiedBy",
                foreignField: "_id",
                as: "updator",
              },
            },
            { $unwind: { path: "$updator", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                username: 1,
                email: 1,
                status: 1,
                contactNumber: 1,
                profileImage: 1,
                createdBy: "$creator.email",
                modifiedBy: "$updator.email",
                createdAt: 1,
                updatedAt: 1,
                role: "$role.name",
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const admins = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: admins,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.adminManagement.adminRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      CommonErrorMessage.admin.management.fetchFailed,
      500,
      error
    );
  }
};

// Get Admin by Id
export const GetAdminById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ADMINMANAGEMENT;
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id)
      .select(
        "username email roleId createdBy modifiedBy status profileImage contactNumber"
      )
      .populate([
        { path: "roleId", select: "name access" },
        { path: "createdBy", select: "email" },
        { path: "modifiedBy", select: "email" },
      ]);

    if (!admin) {
      sendError(req, res, CommonErrorMessage.admin.management.notFound, 404);
    }

    sendSuccess(
      req,
      res,
      admin,
      CommonSuccessMessage.admin.adminManagement.adminRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      CommonErrorMessage.admin.management.fetchFailed,
      500,
      error
    );
  }
};

// update the admin
export const UpdateAdmin = async (req: Request, res: Response) => {
  try {
    const hasBodyData =
      req.body &&
      Object.values(req.body).some(
        (value) => value !== undefined && value !== null && value !== ""
      );
    const hasFileData = req.file && req.file.filename;

    if (!hasBodyData && !hasFileData) {
      deleteFile(req.file?.path);
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.oneFieldRequired,
        400
      );
    }

    const { id } = req.params;
    const adminId = req.admin?._id;
    const { username, email, password, roleId, contactNumber, status } =
      req.body;
    const superAdminPassword = req.body?.superAdminPassword;
    const otherSuperAdminPassword = req.body?.otherSuperAdminPassword;

    const admin: any = await Admin.findById(id).populate("roleId");
    if (!admin) {
      deleteFile(req.file?.path);
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.notFound,
        404
      );
    }

    // Prevent duplicate email
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email });
      if (emailExists) {
        deleteFile(req.file?.path);
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.management.emailAlreadyExists,
          400
        );
      }
    }

    // checking role exists or not
    if (roleId) {
      const existingRole = await Role.findById(roleId);
      if (!existingRole) {
        deleteFile(req.file?.path);
        return sendError(req, res, CommonErrorMessage.admin.role.notFound);
      }
    }

    // Prevent changing Super Admin password unless it's self-update
    if (
      admin?.roleId?.name === "super_admin" &&
      password &&
      req?.admin?._id.toString() !== admin?._id.toString()
    ) {
      deleteFile(req.file?.path);
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.superAdminPasswordChangeNotAllowed,
        403
      );
    }

    // Check if new role is super_admin
    const newRole = roleId ? await Role.findById(roleId) : null;
    const isPromotingToSuperAdmin = newRole?.name === "super_admin";
    if (isPromotingToSuperAdmin) {
      if (!superAdminPassword) {
        deleteFile(req.file?.path);
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.management
            .passwordRequiredToPromoteSuperAdmin,
          400
        );
      }

      const requester: any = await Admin.findById(req?.admin?._id).populate(
        "roleId"
      );

      // Validate super_admin password
      const isMatch = await comparePassword(
        superAdminPassword,
        requester?.password
      );
      if (!isMatch) {
        deleteFile(req.file?.path);
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.management.invalidSuperAdminCredentials,
          403
        );
      }
    }

    // Prevent accidental self-demotion (optional safety)
    if (
      req?.admin?._id?.toString() == admin?._id?.toString() &&
      newRole &&
      newRole?.name !== "super_admin"
    ) {
      deleteFile(req.file?.path);
      return sendError(
        req,
        res,
        CommonErrorMessage?.admin.management.cannotRemoveOwnSuperAdmin,
        403
      );
    }

    const superAdminCount = await Admin.countDocuments({
      roleId: req?.admin?.roleId._id,
      isDeleted: DeletedEnum.NOT_DELETED,
    });

    if (
      superAdminCount <= 1 &&
      admin?.roleId?.name === "super_admin" &&
      newRole?.name !== "super_admin"
    ) {
      deleteFile(req.file?.path);
      return sendError(req, res, "Cannot delete/demote last super admin", 403);
    }

    // when admin we are updating is super admin and we try to change their role, their password is required to do that
    if (
      admin?.roleId?.name === "super_admin" &&
      newRole &&
      newRole?.name !== "super_admin"
    ) {
      if (!otherSuperAdminPassword) {
        deleteFile(req.file?.path);
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.management.targetPasswordRequiredToDemote,
          400
        );
      }

      const isMatch = await comparePassword(
        otherSuperAdminPassword,
        admin?.password
      );
      if (!isMatch) {
        deleteFile(req.file?.path);
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.management.targetPasswordIncorrect,
          403
        );
      }
    }

    if (
      (String(status) === String(AdminStatus.INACTIVE) ||
        String(status) === String(AdminStatus.SUSPENDED)) &&
      admin?.roleId?.name === "super_admin"
    ) {
      deleteFile(req.file?.path);
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.cannotUpdateSuperAdminStatus
      );
    }

    // Update fields
    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.contactNumber = contactNumber || admin.contactNumber;
    admin.roleId = roleId || admin.roleId;
    admin.status = status || admin.status;
    admin.modifiedBy = adminId;

    if (req.file?.filename) {
      const fullPath = path.join(process.cwd(), "public", admin?.profileImage);
      deleteFile(fullPath);
      const fileName = req.file?.filename;
      admin.profileImage = `/admin-profile/${fileName}`;
    }

    if (password) {
      admin.password = await hashPassword(password);
    }

    const savedAdmin = await admin.save();
    updateLoginHistoryToLogout({
      personIds: [savedAdmin?._id],
    });

    const { password: _, ...adminData } = admin.toObject();

    sendSuccess(
      req,
      res,
      adminData,
      CommonSuccessMessage.admin.adminManagement.adminUpdated
    );
  } catch (error: any) {
    deleteFile(req.file?.path);
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.management.updateFailed,
      500,
      error
    );
  }
};

// Delete the admin (soft delete)
export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const superAdminPassword = req.body?.superAdminPassword;

    // Prevent self-deletion
    if (id === req?.admin._id.toString()) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.cannotDeleteOwnAccount,
        400
      );
    }

    const targetAdmin: any = await Admin.findById(id).populate("roleId");
    if (!targetAdmin) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.management.notFound,
        404
      );
    }

    // Check if trying to delete a super admin
    if (targetAdmin?.roleId?.name === "super_admin") {
      if (!superAdminPassword) {
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.management
            .passwordRequiredToDeleteSuperAdmin,
          400
        );
      }

      const isMatch = await comparePassword(
        superAdminPassword,
        targetAdmin?.password
      );

      if (!isMatch) {
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.management.invalidPasswordForSuperAdmin,
          403
        );
      }
    }

    const superAdminCount = await Admin.countDocuments({
      roleId: req?.admin?.roleId._id,
      isDeleted: DeletedEnum.NOT_DELETED,
    });

    if (superAdminCount <= 1 && targetAdmin?.roleId?.name === "super_admin") {
      return sendError(req, res, "Cannot delete/demote last super admin", 403);
    }

    // updated the admin deleted status to deleted
    await Admin.findByIdAndUpdate(id, {
      $set: { isDeleted: DeletedEnum.DELETED },
    });

    // logout that admin from there account
    await updateLoginHistoryToLogout({ personIds: targetAdmin?._id });

    sendSuccess(
      req,
      res,
      null,
      CommonSuccessMessage.admin.adminManagement.adminDeleted
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.management.deleteFailed,
      500,
      error
    );
  }
};
