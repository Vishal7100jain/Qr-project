import { Request, Response } from "express";
import { FilterQuery, PipelineStage } from "mongoose";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { PersonTypeEnum, StatusEnum } from "../../../constants/admin.enums";
import { RoleEnum } from "../../../constants/enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import {
  ActivityLog,
  IActivityLog,
} from "../../../models/admin/activityLog.model";
import LoginHistory from "../../../models/admin/loginHistory.model";
import MemberLoginHistory from "../../../models/member/memberLoginHistory.model";

// Get Admin Login History
export const GetAdminLoginHistory = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ADMIN_LOGIN_HISTORY;

  try {
    const admin = req?.admin;
    const {
      page = 1,
      pageSize = 10,
      emailSearch = "", // admin email search
      status, // isActive filter
      type, // personType: ADMIN (1) or ARTIST (2)
    } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);

    const matchStage: any = {
      personType: Number(type) || PersonTypeEnum.ADMIN, // default ADMIN
    };

    if (status !== undefined && status !== null) {
      matchStage.isActive = Number(status);
    }

    const superAdminFilter: any = {};
    if (admin?.roleId?.name !== "super_admin") {
      superAdminFilter["role.name"] = { $ne: "super_admin" };
    }

    const result = await LoginHistory.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "admins",
          localField: "personId",
          foreignField: "_id",
          as: "admin",
        },
      },
      { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "roles",
          localField: "admin.roleId",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
      { $match: superAdminFilter },
      ...(emailSearch
        ? [
            {
              $match: {
                "admin.email": {
                  $regex: String(emailSearch).trim(),
                  $options: "i",
                },
              },
            },
          ]
        : []),
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
            {
              $project: {
                _id: 1,
                loginAt: 1,
                logoutAt: 1,
                ipAddress: 1,
                userAgent: 1,
                isActive: 1,
                personType: 1,
                admin: {
                  email: "$admin.email",
                  _id: "$admin._id",
                },
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const loginHistory = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: loginHistory,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
      (PersonTypeEnum[Number(type)]?.toLowerCase() ||
        String(PersonTypeEnum[1]).toLowerCase()) +
        CommonSuccessMessage.admin.history.loginRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.history.loginFetchFailed,
      500,
      error
    );
  }
};

// Get Admin Activity History
export const GetAdminActivityHistory = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.ADMIN_ACTIVITY_HISTORY;

  try {
    const admin = req?.admin;
    const {
      page = 1,
      pageSize = 10,
      search = "",
      statusCode,
      emailSearch,
    } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    // 1. Build base filter (ensure pRole is always first for index usage)
    const filter: FilterQuery<IActivityLog> = { pRole: RoleEnum.ADMIN };

    // 2. Apply search filters
    if (search) {
      const searchRegex = new RegExp(String(search).trim(), "i");
      filter.$or = [{ mo: searchRegex }, { url: searchRegex }];
    }

    if (statusCode && !isNaN(Number(statusCode))) {
      filter.sC = Number(statusCode);
    }

    // 3. Get count FIRST (with minimal filtering)
    const totalPromise = ActivityLog.countDocuments(filter);

    // 4. Main query pipeline
    const pipeline: PipelineStage[] = [
      { $match: filter },
      { $sort: { createdAt: -1, updatedAt: 1 } },
      { $skip: skip },
      { $limit: Number(pageSize) },
      {
        $lookup: {
          from: "admins",
          localField: "pId",
          foreignField: "_id",
          as: "admin",
          // Only get needed fields
          pipeline: [
            { $project: { email: 1, roleId: 1 } },
            ...(admin?.roleId?.name !== "super_admin"
              ? [
                  {
                    $lookup: {
                      from: "roles",
                      localField: "roleId",
                      foreignField: "_id",
                      as: "role",
                      pipeline: [{ $match: { name: { $ne: "super_admin" } } }],
                    },
                  },
                ]
              : []),
            { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
      // Apply email filter AFTER lookup to avoid complex sub-pipeline
      ...(emailSearch
        ? [
            {
              $match: {
                "admin.email": new RegExp(String(emailSearch).trim(), "i"),
              },
            },
          ]
        : []),
      {
        $project: {
          person: { email: "$admin.email", _id: "$admin._id" },
          mo: 1,
          ac: 1,
          des: 1,
          url: 1,
          ipAdd: 1,
          agent: 1,
          sC: 1,
          tiToRes: 1,
          createdAt: 1,
        },
      },
    ];

    // 5. Execute queries sequentially (better for connection pooling)
    const total = await totalPromise;
    const data = await ActivityLog.aggregate(pipeline);

    sendSuccess(
      req,
      res,
      {
        data,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.history.activityRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.history.activityFetchFailed,
      500,
      error
    );
  }
};

// Get Member Login History
export const GetMemberLoginHistory = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.MEMBER_LOGIN_HISTORY;

  try {
    const { page = 1, pageSize = 10, search = "", status } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {};
    if (status !== undefined && status !== null) {
      if (Number(status) == StatusEnum.ACTIVE) {
        filter.logoutAt = { $gt: new Date() };
      } else if (Number(status) == StatusEnum.INACTIVE) {
        filter.logoutAt = { $lt: new Date() };
      }
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const result = await MemberLoginHistory.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1, updatedAt: 1 } },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: { path: "$member", preserveNullAndEmptyArrays: true } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
            {
              $project: {
                member: "$member",
                oAuthProviderId: 1,
                email: 1,
                token: 1,
                oAuthType: 1,
                isSuccessful: 1,
                loginAt: 1,
                logoutAt: 1,
                ipAddress: 1,
                userAgent: 1,
                isActive: {
                  $cond: {
                    if: { $gt: ["$logoutAt", new Date()] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const loginHistory = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: loginHistory,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.history.loginRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.history.loginFetchFailed,
      500,
      error
    );
  }
};

// Get Member Activity History
export const GetMemberActivityHistory = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.MEMBER_ACTIVITY_HISTORY;
  

  try {
    const {
      page = 1,
      pageSize = 10,
      search = "",
      statusCode,
      emailSearch,
    } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    const filter: any = {
      pRole: RoleEnum.MEMBER,
    };

    if (search) {
      filter.$or = [
        { mo: { $regex: String(search).trim(), $options: "i" } },
        { url: { $regex: String(search).trim(), $options: "i" } },
      ];
    }

    if (Number(statusCode) && statusCode !== undefined && statusCode !== null) {
      filter.sC = { $eq: Number(statusCode) };
    }

    const result = await ActivityLog.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "members",
          localField: "pId",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: { path: "$member", preserveNullAndEmptyArrays: true } },
      ...(emailSearch
        ? [
            {
              $match: {
                "member.email": {
                  $regex: String(emailSearch).trim(),
                  $options: "i",
                },
              },
            },
          ]
        : []),

      { $sort: { createdAt: -1, updatedAt: 1 } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(pageSize) },
            {
              $project: {
                person: { email: "$member.email", _id: "$member._id" },
                mo: 1,
                ac: 1,
                des: 1,
                url: 1,
                ipAdd: 1,
                agent: 1,
                sC: 1,
                tiToRes: 1,
                createdAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const activity = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: activity,
        total,
        page: Number(page),
        pageSize: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.history.activityRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      error?.message || CommonErrorMessage.admin.history.activityFetchFailed,
      500,
      error
    );
  }
};
