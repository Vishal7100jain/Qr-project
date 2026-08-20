import express from "express";
// import {
//   verifyOtpLogin,
//   verifyOtpSignUp,
// } from "../../../controllers/v1/member/otp.controller";

const MemberOTPRouter = express.Router();

// // OTP Verify for sign up
// MemberOTPRouter.post(
//   "/verify/signup",
//   validateData({ body: verifyOTPSignUpSchema }),
//   verifyOtpSignUp
// );

// // OTP Verification for Login
// MemberOTPRouter.post(
//   "/verify/login",
//   validateData({ body: verifyOTPLoginSchema }),
//   verifyOtpLogin
// );

export default MemberOTPRouter;
