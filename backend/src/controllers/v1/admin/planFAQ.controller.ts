// planFeatures.controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { DeletedEnum, StatusEnum } from "../../../constants/admin.enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import { PlanFAQ, Plans } from "../../../models/admin/plans.model";

const handlePlanFAQResponse = (faq: any) => {
  return {
    _id: faq._id,
    question: faq?.question,
    answer: faq?.answer,
    planIds: faq?.planIds,
    status: faq?.status,
    createdBy: faq?.createdBy,
    modifiedBy: faq?.modifiedBy,
    createdAt: faq?.createdAt,
    updatedAt: faq?.updatedAt,
  };
};

// Plan FAQs Controllers
export const CreatePlanFAQ = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFAQ;
  try {
    const { planIds, question, answer, status = StatusEnum.ACTIVE } = req.body;

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
        CommonErrorMessage.admin.planFAQ.planNotFound,
        404
      );
    }

    const adminId = req.admin?._id;
    const newFAQ = await PlanFAQ.create({
      question,
      answer,
      planIds,
      status,
      createdBy: adminId,
      modifiedBy: adminId,
    });

    if (!newFAQ) {
      return sendError(req, res, CommonErrorMessage.admin.planFAQ.create, 400);
    }

    return sendSuccess(
      req,
      res,
      handlePlanFAQResponse(newFAQ),
      CommonSuccessMessage.admin.planFAQ.create
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.planFAQ.create,
      500
    );
  }
};

// Get Plan FAQs
export const GetPlanFAQs = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFAQ;
  try {
    const { page = 1, pageSize = 10, search = "", status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const baseFilter: any = {};

    if (status !== undefined && status !== null) {
      baseFilter.status = { $eq: Number(status) };
    }

    const result = await PlanFAQ.aggregate([
      { $match: baseFilter },
      { $sort: { createdAt: -1, updatedAt: -1 } },
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

      // ✅ Apply search across FAQ fields + ALL plans inside array
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { question: { $regex: search, $options: "i" } },
                  { answer: { $regex: search, $options: "i" } },
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
                question: 1,
                answer: 1,
                status: 1,
                plans: 1, // ✅ stays array
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

    const faqs = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: faqs,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.planFAQ.retrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      CommonErrorMessage.admin.planFAQ.fetchFailed,
      500,
      error
    );
  }
};

// Update Plan FAQ By Id
export const UpdatePlanFAQ = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFAQ;

  try {
    const { id } = req.params;
    const updateData = req.body;

    const faq = await PlanFAQ.findOne({ _id: id }).lean();

    if (!faq) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFAQ.FaqNotFound,
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
          CommonErrorMessage.admin.planFAQ.planNotFound,
          404
        );
      }
    }

    const adminId = req.admin?._id;
    const updatedFAQ = await PlanFAQ.findByIdAndUpdate(
      id,
      { $set: { ...updateData, modifiedBy: adminId } },
      { new: true, lean: true }
    );

    if (!updatedFAQ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFAQ.updateFailed,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      handlePlanFAQResponse(updatedFAQ),
      CommonSuccessMessage.admin.planFAQ.update
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.planFAQ.updateFailed,
      500
    );
  }
};

// Delete Plan Faq By Id
export const DeletePlanFAQ = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFAQ;
  try {
    const { id } = req.params;

    const faq = await PlanFAQ.findOne({ _id: id });

    if (!faq) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFAQ.FaqNotFound,
        404
      );
    }

    const deletedFAQ = await PlanFAQ.findByIdAndDelete(id);

    if (!deletedFAQ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFAQ.deleteFailed,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      handlePlanFAQResponse(deletedFAQ),
      CommonSuccessMessage.admin.planFAQ.delete
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.planFAQ.deleteFailed,
      500
    );
  }
};

// Get Plan Faq By ID
export const GetPlanFaqById = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.PLANFAQ;

  try {
    const { id } = req.params;
    const planFAQ = await PlanFAQ.findOne({
      _id: id,
    })
      .populate({ path: "planIds", select: "planName slug planType" })
      .lean();

    if (!planFAQ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.admin.planFAQ.FaqNotFound,
        400
      );
    }

    return sendSuccess(
      req,
      res,
      planFAQ,
      CommonSuccessMessage.admin.planFAQ.retrieved
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.planFAQ.FaqNotFound,
      500
    );
  }
};
