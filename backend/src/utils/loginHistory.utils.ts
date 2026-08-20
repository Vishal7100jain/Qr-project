import mongoose from "mongoose";
import { AdminStatus } from "../constants/admin.enums";
import LoginHistory from "../models/admin/loginHistory.model";
import MemberLoginHistory from "../models/member/memberLoginHistory.model";

/**
 * Creates a new admin login history record
 * @param personId - The ID of the admin who logged in
 * @param ipAddress - The IP address from which the admin logged in
 * @param userAgent - The user agent string of the admin's device
 * @returns Promise<ILoginHistory> - The created login history record
 */
export const createLoginHistory = async ({
  personId,
  personType,
  ipAddress,
  userAgent,
  logoutAt,
}: {
  personId: String;
  personType: Number;
  ipAddress: string | any;
  userAgent: string | any;
  logoutAt?: Date;
}): Promise<any> => {
  try {
    await LoginHistory.create({
      personId,
      personType,
      ipAddress,
      userAgent,
      isActive: AdminStatus.ACTIVE,
      logoutAt,
    });
    return;
  } catch (error) {
    console.error("Error creating login history:", error);
    throw error;
  }
};

/**
 * Updates admin login history record(s) for logout
 * @param adminIds - Single ID or array of IDs of admins who logged out
 * @returns Promise<{
 *   successCount: number;
 *   failedCount: number;
 *   results: mongoose.UpdateWriteOpResult[];
 * }> - Summary of update operations
 */
export const updateLoginHistoryToLogout = async ({
  personIds,
  options = {},
}: {
  personIds:
    | mongoose.Types.ObjectId
    | mongoose.Types.ObjectId[]
    | string
    | string[];
  options?: { session?: mongoose.ClientSession };
}): Promise<{
  successCount: number;
  failedCount: number;
  results: mongoose.UpdateWriteOpResult[];
}> => {
  try {
    // Normalize to array
    const idsArray = Array.isArray(personIds) ? personIds : [personIds];

    const filter: any = {
      personId: { $in: idsArray },
      isActive: AdminStatus.ACTIVE,
    };

    const result = await LoginHistory.updateMany(
      filter,
      {
        $set: {
          logoutAt: new Date(),
          isActive: AdminStatus.INACTIVE,
        },
      },
      { session: options?.session }
    );

    return {
      successCount: result.modifiedCount,
      failedCount: idsArray.length - result.modifiedCount,
      results: [result],
    };
  } catch (error) {
    console.error("Error in bulk login history update:", error);
    throw error;
  }
};

export const UpdateMemberToLogout = async ({
  memberIds,
  options = {},
}: {
  memberIds:
    | mongoose.Types.ObjectId
    | mongoose.Types.ObjectId[]
    | string
    | string[];
  options?: { session?: mongoose.ClientSession };
}): Promise<{
  successCount: number;
  failedCount: number;
  results: mongoose.UpdateWriteOpResult[];
}> => {
  try {
    // Normalize to array
    const idsArray = Array.isArray(memberIds) ? memberIds : [memberIds];

    const filter: any = {
      memberId: { $in: idsArray },
      isSuccessful: true,
    };

    const result = await MemberLoginHistory.updateMany(
      filter,
      {
        $set: {
          logoutAt: new Date(),
        },
      },
      { session: options?.session }
    );

    return {
      successCount: result.modifiedCount,
      failedCount: idsArray.length - result.modifiedCount,
      results: [result],
    };
  } catch (error) {
    console.error("Error in bulk login history update:", error);
    throw error;
  }
};
