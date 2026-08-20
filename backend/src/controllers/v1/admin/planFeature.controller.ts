// planFeatures.controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { DeletedEnum } from "../../../constants/admin.enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import { PlanFeature, Plans } from "../../../models/admin/plans.model";

// Common response handlers
const handlePlanFeatureResponse = (feature: any) => {
  return {
    _id: feature._id,
    feature: feature.feature,
    planIds: feature.planIds,
    status: feature.status,
    createdBy: feature.createdBy,
    modifiedBy: feature.modifiedBy,
    createdAt: feature.createdAt,
    updatedAt: feature.updatedAt,
  };
};

// Plan Features Create
export const CreatePlanFeature = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFEATURE;
  try {
    const { planIds, feature, status } = req.body;

    // Check if plan exists and is not deleted
    const planExists = await Plans.aggregate([
      {
        $match: {
          _id: {
            $in: planIds?.map((item: string) =>
              mongoose.Types.ObjectId.createFromHexString(String(item))
            ),
          },
          isDeleted: DeletedEnum.NOT_DELETED,
        },
      },
    ]);

    if (planExists.length !== planIds?.length) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFeature.planNotFound,
        404
      );
    }

    const adminId = req?.admin?._id;
    const newFeature = await PlanFeature.create({
      feature,
      planIds,
      status,
      createdBy: adminId,
      modifiedBy: adminId,
    });

    if (!newFeature) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFeature.createPF,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      handlePlanFeatureResponse(newFeature),
      CommonSuccessMessage.admin.planFeature.create
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.planFeature.createPF,
      500
    );
  }
};

// Get Plan Feature list for the table
export const GetPlanFeatures = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFEATURE;

  try {
    const { page = 1, pageSize = 10, search = "", status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};

    if (status !== undefined && status !== null) {
      filter.status = { $eq: Number(status) };
    }

    const result = await PlanFeature.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      // ✅ Apply search across FAQ fields + ALL plans inside array
      {
        $lookup: {
          from: "plans",
          localField: "planIds",
          foreignField: "_id",
          as: "plans",
          pipeline: [
            {
              $project: { planType: 1, planName: 1, slug: 1, status: 1 },
            },
          ],
        },
      },

      ...(search
        ? [
            {
              $match: {
                $or: [
                  { feature: { $regex: search, $options: "i" } },
                  { "plans.planName": { $regex: search, $options: "i" } },
                  { "plans.slug": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

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
                as: "createdBy",
                pipeline: [
                  { $project: { username: 1, email: 1, profileImage: 1 } },
                ],
              },
            },
            {
              $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: "admins",
                localField: "modifiedBy",
                foreignField: "_id",
                as: "modifiedBy",
                pipeline: [
                  { $project: { username: 1, email: 1, profileImage: 1 } },
                ],
              },
            },
            {
              $unwind: {
                path: "$modifiedBy",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                feature: 1,
                status: 1,
                plans: 1,
                createdBy: 1,
                modifiedBy: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const features = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: features,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.planFeature.retrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      CommonErrorMessage.admin.planFeature.fetchFailed,
      500,
      error
    );
  }
};

// Update Plan Feature by id
export const UpdatePlanFeature = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFEATURE;

  try {
    const { id } = req.params;
    const updateData = req.body;
    const adminId = req?.admin?._id;

    const feature = await PlanFeature.findOne({ _id: id }).lean();

    if (!feature) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFeature.featureNotFound,
        404
      );
    }

    if (updateData?.planIds) {
      // Check if plan exists and is not deleted
      const planExists = await Plans.aggregate([
        {
          $match: {
            _id: {
              $in: updateData?.planIds?.map((item: string) =>
                mongoose.Types.ObjectId.createFromHexString(String(item))
              ),
            },
            isDeleted: DeletedEnum.NOT_DELETED,
          },
        },
      ]);

      if (planExists.length !== updateData?.planIds?.length) {
        return sendError(
          req,
          res,
          CommonErrorMessage.admin.planFeature.planNotFound,
          404
        );
      }
    }

    const updatedFeature = await PlanFeature.findByIdAndUpdate(
      id,
      { $set: { ...updateData, modifiedBy: adminId } },
      { new: true, lean: true }
    );

    if (!updatedFeature) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFeature.updateFailed,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      handlePlanFeatureResponse(updatedFeature),
      CommonSuccessMessage.admin.planFeature.update
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.planFeature.updateFailed,
      500
    );
  }
};

// delete Plan feature
export const DeletePlanFeature = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFEATURE;

  try {
    const { id } = req.params;

    const feature = await PlanFeature.findOne({ _id: id });

    if (!feature) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFeature.featureNotFound,
        404
      );
    }

    const deletedFeature = await PlanFeature.findByIdAndDelete(id);

    if (!deletedFeature) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFeature.deleteFailed,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      handlePlanFeatureResponse(deletedFeature),
      CommonSuccessMessage.admin.planFeature.delete
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.planFeature.deleteFailed,
      500
    );
  }
};

// Get Plan Feature By ID
export const GetPlanFeatureById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFEATURE;

  try {
    const { id } = req.params;
    const planFeature = await PlanFeature.findOne({
      _id: id,
    })
      .populate({ path: "planIds", select: "planName slug planType" })
      .lean();

    if (!planFeature) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFeature.featureNotFound,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      planFeature,
      CommonSuccessMessage.admin.planFeature.retrieved
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.planFeature.featureNotFound,
      500
    );
  }
};
