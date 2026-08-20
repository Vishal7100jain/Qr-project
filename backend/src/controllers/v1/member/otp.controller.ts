// import { Request, Response } from "express";
// import { sendError, sendSuccess } from "../../../common/sender.common";
// import { envConfig } from "../../../config/env.config";
// import { DeletedEnum, VerifiedEnum } from "../../../constants/admin.enums";
// import { AuthType, OtpStatus, OtpType } from "../../../constants/enums";
// import Member from "../../../models/member/member.model";
// import MemberLoginHistory from "../../../models/member/memberLoginHistory.model";
// import OtpModel from "../../../models/member/otp.model";
// import { handleMemberDataResponse } from "../../../utils/member.utils";

// // verify otp for sign up
// export const verifyOtpSignUp = async (req: Request, res: Response) => {
//   try {
//     const { email, emailOTP, phoneNumberOTP, phoneNumber } = req.body;

//     // ⚡ Fast lean lookup
//     const member = await Member.findOne({
//       email,
//       phoneNumber,
//       isDeleted: DeletedEnum.NOT_DELETED,
//     });

//     if (!member) {
//       return sendError(req, res, "Member not found, Register first", 404);
//     }

//     const otpData = await OtpModel.findOne({
//       memberId: member._id,
//       code: emailOTP,
//       status: OtpStatus.ACTIVE,
//       type: OtpType.email,
//     });

//     if (!otpData) {
//       return sendError(req, res, "Invalid OTP", 400);
//     }

//     if (new Date() > otpData.expiresAt) {
//       otpData.status = OtpStatus.EXPIRED;
//       await otpData.save();
//       return sendError(req, res, "OTP expired, Please try again!", 400);
//     }

//     // ✅ Batch update OTP & Member (fast writes)
//     const updates = [
//       OtpModel.updateOne(
//         { _id: otpData._id },
//         { $set: { status: OtpStatus.USED } }
//       ),
//       Member.updateOne(
//         { _id: member._id },
//         {
//           $set: {
//             isVerifiedEmail: VerifiedEnum.VERIFIED,
//             isVerifiedNumber: VerifiedEnum.VERIFIED,
//             isVerified: VerifiedEnum.VERIFIED,
//           },
//         }
//       ),
//     ];

//     await Promise.all(updates);

//     // ✅ Token generation stays as-is
//     const token = generateMemberToken({
//       fullName: member.fullName,
//       _id: member._id,
//       email: member.email,
//     });

//     // ✅ Use a safe lean lookup if needed inside handleMemberDataResponse
//     return sendSuccess(
//       req,
//       res,
//       handleMemberDataResponse({ data: member, token }),
//       "Account created successfully"
//     );
//   } catch (error: any) {
//     return sendError(req, res, error?.message || "Failed to verify OTP", 500);
//   }
// };

// // verify otp for Login
// export const verifyOtpLogin = async (req: Request, res: Response) => {
//   try {
//     const { email, emailOTP } = req.body;

//     const member = await Member.findOne({
//       email,
//       isDeleted: DeletedEnum.NOT_DELETED,
//       isVerified: VerifiedEnum.VERIFIED,
//     }).lean();

//     if (!member) {
//       return sendError(req, res, "Member not found, Register first", 404);
//     }

//     const otpData = await OtpModel.findOne(
//       {
//         memberId: member._id,
//         code: emailOTP,
//         status: OtpStatus.ACTIVE,
//         type: OtpType.email,
//       },
//       "_id expiresAt"
//     ).lean();

//     if (!otpData) {
//       return sendError(req, res, "Invalid OTP", 400);
//     }

//     if (new Date() > otpData.expiresAt) {
//       await OtpModel.updateOne(
//         { _id: otpData._id },
//         { $set: { status: OtpStatus.EXPIRED } }
//       );
//       return sendError(req, res, "OTP expired, Please try again!", 400);
//     }

//     // ✅ Mark OTP as used fast
//     const otpUpdate = OtpModel.updateOne(
//       { _id: otpData._id },
//       { $set: { status: OtpStatus.USED } }
//     );

//     // ✅ Token generation
//     const token = generateMemberToken({
//       fullName: member.fullName,
//       _id: member._id,
//       email: member.email,
//     });

//     // ✅ Find & update login history
//     const loginHistory = await MemberLoginHistory.findOne(
//       {
//         email,
//         memberId: member._id,
//         oAuthType: AuthType.CUSTOM,
//         isSuccessful: false,
//       },
//       "_id"
//     )
//       .sort({ createdAt: -1 })
//       .lean();

//     const loginUpdate = loginHistory
//       ? MemberLoginHistory.updateOne(
//           { _id: loginHistory._id },
//           {
//             $set: {
//               isSuccessful: true,
//               logoutAt: new Date(Date.now() + envConfig.adminLogoutTimeSecond),
//               token,
//             },
//           }
//         )
//       : Promise.resolve(); // In case login history is not found (edge case)

//     // ✅ Run DB updates in parallel
//     await Promise.all([otpUpdate, loginUpdate]);

//     return sendSuccess(
//       req,
//       res,
//       handleMemberDataResponse({ data: member, token }),
//       `Welcome back, ${member.fullName}!`
//     );
//   } catch (error: any) {
//     return sendError(req, res, error?.message || "Failed to verify OTP", 500);
//   }
// };
