import { Request, Response } from "express";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { DeletedEnum } from "../../../constants/admin.enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { ModuleName } from "../../../constants/permissions.constants";
import Booking from "../../../models/member/Booking.model";

// Get Booking List
export const GetBookings = async (req: Request, res: Response) => {
  req.moduleName = ModuleName.BOOKING_MANAGEMENT;

  try {
    // TODO : we have to add the artist email in this after the artist module get created artist status also
    const {
      page = 1,
      pageSize = 10,
      search = "",
      serviceType,
      memberEmail,
      pincode,
      adminStatus,
      appointmentDateFrom,
      appointmentDateTo,
      minBudget,
      maxBudget,
    } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);

    // Build filter object
    const filter: any = { isDeleted: DeletedEnum.NOT_DELETED };

    // Search filter
    if (search) {
      const occasionTypeSearch = String(search).split(" ").join("_");
      filter.$or = [
        {
          occasionType: {
            $regex: occasionTypeSearch,
            $options: "i",
          },
        },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Service type filter
    if (serviceType) {
      filter.serviceType = Number(serviceType);
    }

    // Pincode filter
    if (pincode) {
      filter.pincode = Number(pincode);
    }

    // // Artist status filter
    // if (artistStatus) {
    //   filter.artistStatus = Number(artistStatus);
    // }

    // Admin status filter
    if (adminStatus) {
      filter.adminStatus = Number(adminStatus);
    }

    // // Occasion type filter
    // if (occasionType) {
    //   filter.occasionType = { $regex: occasionType, $options: "i" };
    // }

    // Budget range filter
    if (minBudget || maxBudget) {
      if (minBudget && maxBudget) {
        filter.$and = [
          { "budget.min": { $gte: Number(minBudget) } },
          { "budget.max": { $lte: Number(maxBudget) } },
        ];
      } else if (minBudget) {
        filter["budget.min"] = { $gte: Number(minBudget) };
      } else if (maxBudget) {
        filter["budget.max"] = { $lte: Number(maxBudget) };
      }
    }

    // Appointment date range filter
    if (appointmentDateFrom || appointmentDateTo) {
      filter.appointmentDate = {};
      if (appointmentDateFrom) {
        filter.appointmentDate.$gte = new Date(appointmentDateFrom as string);
      }
      if (appointmentDateTo) {
        const endOfDay = new Date(appointmentDateTo as string);
        endOfDay.setHours(23, 59, 59, 999);
        filter.appointmentDate.$lte = endOfDay;
      }
    }

    const aggregationPipeline: any[] = [
      { $match: filter },
      { $sort: { createdAt: -1 } },
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
        $lookup: {
          from: "artists",
          localField: "artistId",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: { path: "$artist", preserveNullAndEmptyArrays: true } },
    ];

    // Artist email filter (after lookup)
    // if (artistEmail) {
    //   aggregationPipeline.push({
    //     $match: {
    //       "artist.email": { $regex: artistEmail as string, $options: "i" },
    //     },
    //   });
    // }

    // Member email filter (after lookup)
    if (memberEmail) {
      aggregationPipeline.push({
        $match: {
          "member.email": { $regex: memberEmail as string, $options: "i" },
        },
      });
    }

    // Add facet for pagination
    aggregationPipeline.push({
      $facet: {
        data: [
          { $skip: skip },
          { $limit: Number(pageSize) },
          {
            $project: {
              serviceType: 1,
              appointmentDate: 1,
              preferredTime: 1,
              occasionType: 1,
              styles: 1,
              budget: 1,
              location: 1,
              pincode: 1,
              additionalDetails: 1,
              adminStatus: 1,
              artistStatus: 1,
              artistStatusDescription: 1,
              isVerified: 1,
              createdAt: 1,
              updatedAt: 1,
              member: {
                _id: "$member._id",
                fullName: "$member.fullName",
                email: "$member.email",
                phoneNumber: "$member.phoneNumber",
                profilePic: "$member.profilePic",
                gender: "$member.gender",
              },
              // "artist.username": 1,
              // "artist.email": 1,
              // "artist.contactNumber": 1,
              // "artist.profileImage": 1,
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    });

    const result = await Booking.aggregate(aggregationPipeline);

    const bookings = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    sendSuccess(
      req,
      res,
      {
        data: bookings,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize)),
      },
      CommonSuccessMessage.admin.booking.bookingRetrieved
    );
  } catch (error: any) {
    sendError(
      req,
      res,
      CommonErrorMessage.admin.booking.bookingFetchFailed,
      500,
      error
    );
  }
};
