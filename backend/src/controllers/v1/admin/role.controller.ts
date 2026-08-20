import { Request, Response } from "express";
import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../../common/sender.common";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import Admin from "../../../models/admin/admin.model";
import Role from "../../../models/admin/role.model";
import { updateLoginHistoryToLogout } from "../../../utils/loginHistory.utils";

const UpdateAdminsRoleToDefaultOnDelete = async (
  roleId: string | string[],
  session: mongoose.ClientSession
) => {
  const defaultRole = await Role.findOne({ name: "default" }).session(session);
  if (!defaultRole) {
    throw new Error("Default role not found");
  }

  // Find all admins with the role being deleted
  const adminsToUpdate = await Admin.find({ roleId }, "_id").session(session);
  const adminIds: any = adminsToUpdate.map((admin) => admin._id);

  // Update all admins having this role to default role
  await Admin.updateMany(
    { roleId }, // all admins with deleted role
    { $set: { roleId: defaultRole._id } },
    { session }
  );
  await updateLoginHistoryToLogout(adminIds);
};

export const CreateRole = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ROLEMANAGEMENT;

  try {
    const { name, description, access } = req.body;
    const adminId = req?.admin?._id;
    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.role.nameAlreadyExists,
        400
      );
    }

    // Create new role
    const newRole = new Role({
      name,
      description,
      access: access || [],
      createdBy: adminId,
      modifiedBy: adminId,
    });

    await newRole.save();

    // Log activity
    sendSuccess(
      req,
      res,
      newRole,
      CommonSuccessMessage.admin.role.roleCreated,
      201
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage?.admin.role.creationFailed,
      500,
      error
    );
  }
};

export const GetRoles = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ROLEMANAGEMENT;

  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const result = await Role.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
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
                name: 1,
                access: 1,
                createdBy: "$creator.email",
                modifiedBy: "$updator.email",
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const Roles = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: Roles,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.role.roleRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.role.fetchFailed,
      500,
      error
    );
  }
};

// Get the list of roles name and ids
export const GetRoleList = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ROLEMANAGEMENT;

  try {
    const result = await Role.find({}, "name _id").lean();
    sendSuccess(
      req,
      res,
      result,
      CommonSuccessMessage.admin.role.roleRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.role.fetchFailed,
      500,
      error
    );
  }
};

export const UpdateRole = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ROLEMANAGEMENT;
  try {
    const { id } = req.params;
    const { name, description, access } = req.body;

    // No one as write to update the default role.
    const isUpdatingDefaultRole = await Role.findById(id, "name").lean();
    if (
      isUpdatingDefaultRole?.name === "default" &&
      name &&
      name !== "default"
    ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.role.cannotUpdateDefaultRole,
        400
      );
    }

    if (
      isUpdatingDefaultRole?.name === "super_admin" &&
      name &&
      name !== "super_admin"
    ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.role.cannotUpdateSuperAdmin,
        400
      );
    }

    const findRoleWithExistingName = await Role.findOne({ name }, "_id").lean();
    if (findRoleWithExistingName) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.role.nameAlreadyExists,
        400
      );
    }

    const adminId = req?.admin?._id;
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name, description, access, modifiedBy: adminId },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return sendError(req, res, CommonErrorMessage.admin.role.notFound, 404);
    }

    const adminsWithRole = await Admin.find({ roleId: id }, "_id").lean();
    const ids = adminsWithRole.map((admin) => admin._id.toString());
    updateLoginHistoryToLogout({
      personIds: Array.from(ids),
    });

    sendSuccess(
      req,
      res,
      updatedRole,
      CommonSuccessMessage.admin.role.updateSuccess
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.role.updateFailed,
      500,
      error
    );
  }
};

export const DeleteRole = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ROLEMANAGEMENT;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const findRoleById = await Role.findOne({ _id: id }).session(session);
    if (!findRoleById) {
      await session.abortTransaction();
      session.endSession();
      return sendError(req, res, CommonErrorMessage.admin.role.notFound, 400);
    }

    if (findRoleById.name === "default") {
      await session.abortTransaction();
      session.endSession();
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.role.cannotDeleteDefaultRole,
        400
      );
    }

    if (findRoleById.name === "super_admin") {
      await session.abortTransaction();
      session.endSession();
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.role.cannotDeleteSuperAdmin,
        400
      );
    }

    // First, delete the role
    const deletedRole = await Role.findByIdAndDelete(id, { session });

    // Then update all admins that had this role
    await UpdateAdminsRoleToDefaultOnDelete(id, session);

    await session.commitTransaction();
    session.endSession();

    return sendSuccess(
      req,
      res,
      deletedRole,
      CommonSuccessMessage.admin.role.deleteSuccess
    );
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return sendError(
      req,
      res,
      CommonErrorMessage.admin.role.deleteFailed,
      500,
      error
    );
  }
};

// Get Role by id
export const GetRoleById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ROLEMANAGEMENT;
  try {
    const { id } = req.params;
    const result = await Role.findById(id).lean();

    if (!result) {
      return sendError(req, res, CommonErrorMessage.admin.role.fetchFailed);
    }
    sendSuccess(
      req,
      res,
      result,
      CommonSuccessMessage.admin.role.roleRetrieved
    );
  } catch (error: any) {
    sendError(req, res, CommonErrorMessage.admin.role.fetchFailed, 500, error);
  }
};
