"use strict";
// import { NextFunction, Request, Response } from "express";
// import { sendError } from "../../common/sender.common";
// import { CommonErrorMessage } from "../../constants/error.messages";
// import Member from "../../models/member/member.model";
// import MemberLoginHistory from "../../models/member/memberLoginHistory.model";
// export const isAuthenticatedMember = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // 1. Check if token exists
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return sendError(req, res, "Authorization header is missing", 401);
//     }
//     // 2. Extract token from header
//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       return sendError(req, res, "Authentication token is required", 401);
//     }
//     // 3. Verify token
//     let decoded: any;
//     try {
//       decoded = verifyMemberToken(token);
//     } catch (jwtError) {
//       return sendError(
//         req,
//         res,
//         (jwtError as Error).message ||
//           "Invalid or expired authentication token",
//         401
//       );
//     }
//     // 4. Find Member in database
//     const member = await Member.findById(decoded?.userData?.user?._id);
//     if (!member) {
//       return sendError(
//         req,
//         res,
//         CommonErrorMessage.member.accountNotFound,
//         401
//       );
//     }
//     // new step to verify is member session is active.
//     const isMemberSession = await MemberLoginHistory.findOne({
//       memberId: member?._id,
//       token,
//     });
//     // checking the member logout time correct or not
//     if (
//       !isMemberSession ||
//       isMemberSession.isSuccessful === false ||
//       (isMemberSession?.logoutAt &&
//         new Date(isMemberSession.logoutAt).getTime() <= Date.now())
//     ) {
//       return sendError(
//         req,
//         res,
//         "Your session has expired or is no longer active.",
//         403
//       );
//     }
//     // 6. Attach member to request and proceed
//     req.member = member;
//     next();
//   } catch (error: any) {
//     console.error("Member authentication error:", error);
//     sendError(
//       req,
//       res,
//       error?.message || "An error occurred during authentication",
//       500
//     );
//   }
// };
