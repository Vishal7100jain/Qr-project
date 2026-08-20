"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {
//   verifyOtpLogin,
//   verifyOtpSignUp,
// } from "../../../controllers/v1/member/otp.controller";
const MemberOTPRouter = express_1.default.Router();
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
exports.default = MemberOTPRouter;
