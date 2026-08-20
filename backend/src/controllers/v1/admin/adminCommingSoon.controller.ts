import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../../common/sender.common";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import CommingSoonSubs from "../../../models/member/commingSoonSubscribe.model";

// Get Comming soon subscriber list
export const GetCommingSoonSubscriber = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.COMMING_SOON_MANAGEMENT;
  try {
    const { page = 1, pageSize = 10, search = "" } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};
    if (search) {
      filter.$or = [{ email: { $regex: search, $options: "i" } }];
    }

    const result = await CommingSoonSubs.aggregate([
      { $match: { ...filter } },
      { $sort: { createdAt: -1, updatedAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
            {
              $project: {
                email: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const member = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: member,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.CommingSoonSubs.comminSoon
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      CommonErrorMessage.admin.CommingSoonSubs.comminSoon,
      500,
      error
    );
  }
};
