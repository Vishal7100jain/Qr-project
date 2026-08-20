import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { DeletedEnum, StatusEnum } from "../../../constants/admin.enums";
import { PlanTypeEnum } from "../../../constants/enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import { IPlan, Plans } from "../../../models/admin/plans.model";

const handlePlanResponse = (plan: IPlan) => {
  return {
    planType: PlanTypeEnum[plan.planType],
    planName: plan.planName,
    price: plan.price,
    discount: plan.discount,
    limits: plan.limits,
    status: plan.status,
    slug: plan.slug,
  };
};

// Create Plan
export const CreatePlan = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANS;
  try {
    const { planType, planName, price, discount, limits, status, slug } =
      req.body;

    const isSluginUse = await Plans.exists({ slug });
    if (isSluginUse) {
      return sendError(req, res, "Plan already exists with this slug", 400);
    }

    const adminId = req.admin?._id;
    const newPlan = await Plans.create({
      planType,
      planName,
      slug,
      price,
      discount,
      limits,
      status,
      createdBy: adminId,
      modifiedBy: adminId,
    });

    if (!newPlan) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.plans.createPlan,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      newPlan,
      CommonSuccessMessage.admin.plans.createPlan
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.plans.createPlan,
      500
    );
  }
};

// Get All Plans
export const GetPlans = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANS;
  try {
    const { page = 1, pageSize = 10, search = "", status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};
    if (search) {
      filter.$or = [
        { planName: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== undefined && status !== null) {
      filter.status = { $eq: Number(status) };
    }

    await Plans.updateMany(
      {},
      { $set: { createdBy: req.admin?._id, modifiedBy: req.admin?._id } }
    );

    const result = await Plans.aggregate([
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
            {
              $unwind: { path: "$creator", preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: "admins",
                localField: "modifiedBy",
                foreignField: "_id",
                as: "updator",
              },
            },
            {
              $unwind: { path: "$updator", preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                planType: 1,
                planName: 1,
                slug: 1,
                price: 1,
                discount: 1,
                limits: 1,
                status: 1,
                isDeleted: 1,
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
      CommonSuccessMessage.admin.plans.planRetrieved
    );
  } catch (error: any) {
    sendError(req, res, CommonErrorMessage.admin.plans.fetchFailed, 500, error);
  }
};

// Update Plan api
export const UpdatePlan = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANS;

  try {
    const { id } = req.params;
    const planToUpdate: any = await Plans.findOne({
      _id: id,
      isDeleted: DeletedEnum.NOT_DELETED,
    }).lean();

    if (!planToUpdate) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.plans.planNotFound,
        400
      );
    }

    const newSlug = req.body?.slug;
    if (newSlug) {
      const isNewSluginUse = await Plans.exists({ slug: newSlug });
      if (isNewSluginUse) {
        return sendError(req, res, "Plan already exists with this slug", 400);
      }
    }

    // checking price of montly and yearly
    if (
      req.body?.price?.monthly &&
      req.body?.price?.yearly &&
      req.body?.price?.monthly >= req.body?.price?.yearly
    ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.plans.monGreaterThanYr,
        400
      );
    } else if (
      req.body?.price?.monthly &&
      req.body?.price?.monthly >= planToUpdate?.price?.yearly
    ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.plans.monGreaterThanYr,
        400
      );
    } else if (
      req.body?.price?.yearly &&
      req.body?.price?.yearly <= planToUpdate?.price?.monthly
    ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.plans.monGreaterThanYr,
        400
      );
    }

    // Update
    const updatePlan = await Plans.findByIdAndUpdate(
      id,
      { $set: { ...req.body } },
      { new: true, lean: true }
    );

    if (!updatePlan) {
      return sendError(req, res, CommonErrorMessage.admin.plans.updateFailed);
    }

    // TODO: WHEN PLAN IS INACTIVE THE ARTIST WHICH ARE LINKED TO THAT PLAN WILL GET LOGOUT AND NO LONGER CAN BE LOGGED IN AGAIN UNTIL THE PLAN IS ACTIVE AGAIN.
    return sendSuccess(
      req,
      res,
      handlePlanResponse(updatePlan),
      CommonSuccessMessage.admin.plans.updateSuccess
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.plans.updateFailed,
      500
    );
  }
};

// Delete Plan api
export const DeletePlan = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANS;

  try {
    const { id } = req.params;
    const plan: any = await Plans.findOne({
      _id: id,
      isDeleted: DeletedEnum.NOT_DELETED,
    }).lean();

    if (!plan) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.plans.planNotFound,
        400
      );
    }

    // Delete
    const DeletePlan = await Plans.findByIdAndUpdate(
      id,
      { $set: { isDeleted: DeletedEnum.DELETED } },
      { new: true, lean: true }
    );

    if (!DeletePlan) {
      return sendError(req, res, CommonErrorMessage.admin.plans.deleteFailed);
    }

    return sendSuccess(
      req,
      res,
      handlePlanResponse(DeletePlan),
      CommonSuccessMessage.admin.plans.deleteSuccess
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.plans.deleteFailed,
      500
    );
  }
};

// Get Plans name list
export const GetPlansList = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANS;

  try {
    const planList = await Plans.find(
      {
        isDeleted: DeletedEnum.NOT_DELETED,
        status: StatusEnum.ACTIVE,
      },
      "_id planName slug"
    ).lean();

    if (!planList.length) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.plans.planNotFound,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      planList,
      CommonSuccessMessage.admin.plans.planRetrieved
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.plans.deleteFailed,
      500
    );
  }
};

// Get Plan By ID
export const GetPlanById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANS;

  try {
    const { id } = req.params;
    const plan = await Plans.findOne({
      _id: id,
      isDeleted: DeletedEnum.NOT_DELETED,
    }).lean();

    if (!plan) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.plans.planNotFound,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      plan,
      CommonSuccessMessage.admin.plans.planRetrieved
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.plans.fetchFailed,
      500
    );
  }
};
