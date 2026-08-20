import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../../common/sender.common";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import AccessPermission from "../../../models/admin/access.model";

// Get Access Management List
export const GetAccessPermissions = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ACCESSMANAGEMENT;
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};
    if (search) {
      filter.$or = [{ moduleName: { $regex: search, $options: "i" } }];
    }

    const result = await AccessPermission.aggregate([
      { $match: { ...filter } },
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
                moduleName: 1,
                permissions: 1,
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
      CommonSuccessMessage.admin.accessManagement.accessRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      CommonErrorMessage.admin.accessManagement.fetchFailed,
      500,
      error
    );
  }
};

// Get Access Management by id
export const GetAccessPermissionsById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ACCESSMANAGEMENT;
  try {
    const { id } = req.params;

    const result = await AccessPermission.findById(id);

    if (!result) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.accessManagement.fetchFailed
      );
    }
    sendSuccess(
      req,
      res,
      result,
      CommonSuccessMessage.admin.accessManagement.accessRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      CommonErrorMessage.admin.accessManagement.fetchFailed,
      500,
      error
    );
  }
};

export const CreateAccessPermission = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ACCESSMANAGEMENT;
  try {
    const { moduleName, permissions } = req.body;
    const adminId = req?.admin?._id;

    const isModuleNameExists = await AccessPermission.findOne(
      { moduleName },
      "_id"
    ).lean();
    if (isModuleNameExists) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.accessManagement.alreadyExistModule,
        400
      );
    }

    const permission = new AccessPermission({
      moduleName,
      permissions,
      createdBy: adminId,
      modifiedBy: adminId,
    });

    const savedPermission = await permission.save();

    if (!savedPermission) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.accessManagement.creationFailed,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      permission,
      CommonSuccessMessage.admin.accessManagement.accessCreated
    );
  } catch (err: any) {
    return sendError(
      req,
      res,
      err?.message || CommonErrorMessage.admin.accessManagement.creationFailed,
      err
    );
  }
};

// Get the list of access modules name and permissions
export const GetAccessPermissionList = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ACCESSMANAGEMENT;

  try {
    const result = await AccessPermission.find(
      {},
      "moduleName permissions _id"
    ).lean();

    sendSuccess(
      req,
      res,
      result,
      CommonSuccessMessage.admin.accessManagement.accessRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.accessManagement.fetchFailed,
      500,
      error
    );
  }
};

export const UpdateAccessPermission = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ACCESSMANAGEMENT;

  try {
    const { id } = req.params;
    const { moduleName, permissions } = req.body;
    const adminId = req?.admin?._id;

    const existingModuleName = await AccessPermission.findOne(
      { moduleName },
      "_id"
    ).lean();

    if (existingModuleName) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.accessManagement.alreadyExistModule
      );
    }

    const updateData: any = {};
    if (moduleName) updateData.moduleName = moduleName;
    if (permissions?.length) updateData.permissions = permissions;

    const updatedData = await AccessPermission.findByIdAndUpdate(id, {
      ...updateData,
      modifiedBy: adminId,
    });

    if (!updatedData) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.accessManagement.updateFailed
      );
    }

    return sendSuccess(
      req,
      res,
      updateData,
      CommonSuccessMessage.admin.accessManagement.accessUpdated
    );
  } catch (err: any) {
    return sendError(
      req,
      res,
      err?.message || CommonErrorMessage.admin.accessManagement.updateFailed,
      err
    );
  }
};

// delete access permission
export const deleteAccessPermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await AccessPermission.findByIdAndDelete(id);
    if (!deleted) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.accessManagement.deleteFailed,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      deleted,
      CommonSuccessMessage.admin.accessManagement.accessDeleted
    );
  } catch (err: any) {
    return sendError(
      req,
      res,
      err?.message || CommonErrorMessage.admin.accessManagement.deleteFailed,
      400
    );
  }
};
