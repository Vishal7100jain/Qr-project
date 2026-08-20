import mongoose from "mongoose";
import { AdminBookingOrderStatus, AuthType } from "../constants/enums";
import Booking from "../models/member/Booking.model";
import MemberLoginHistory from "../models/member/memberLoginHistory.model";
import { IMember } from "./../models/member/member.model";
export const handleMemberDataResponse = ({
  data,
  token,
}: {
  data: IMember;
  token: string;
}) => {
  return {
    _id: data._id,
    fullName: data.fullName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    profilePic: data.profilePic,
    address: data.address,
    gender: data.gender,
    bio: data.bio,
    token,
  };
};

interface IMemberHistoryData {
  email: string;
  oAuthType: AuthType;
  ipAddress?: string;
  userAgent?: string;
  memberId?: mongoose.Types.ObjectId;
  oAuthProviderId?: string;
  isSuccessful: boolean;
}

export const handleMemberLoginHistory = async (data: IMemberHistoryData) => {
  try {
    const newMemberLoginHistory = new MemberLoginHistory({ ...data });
    const saveMemberHistory = await newMemberLoginHistory.save();
    return saveMemberHistory;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const checkBookingFullForMember = async (memberId: any) => {
  const isBookingFull = await Booking.aggregate([
    {
      $match: {
        memberId: mongoose.Types.ObjectId.createFromHexString(memberId),
        adminStatus: {
          $in: [
            AdminBookingOrderStatus.PENDING,
            AdminBookingOrderStatus.CONFIRMED,
          ],
        },
      },
    },
    {
      $group: {
        _id: "$memberId",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        hasReachedLimit: { $gte: ["$count", 10] },
        count: "$count",
      },
    },
  ]);

  return isBookingFull[0]?.hasReachedLimit || false;
};
