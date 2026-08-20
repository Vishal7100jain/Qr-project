import express from "express";
import {
  CreateBooking,
  resendOTPToVerifyEmailForBookingConfirmation,
  UpdateBooking,
  VerifyEmailOTPToConfirmBooking,
  verifyEmailToCreateBooking,
} from "../../../controllers/v1/member/booking.controller";
import {
  CreateBookingMemberNotLogin,
  CreateBookingSchema,
  OTPVerificationSchemaForConfirmationBooking,
  resendOTPBookingSchema,
  UpdatedBookingIdSchema,
  UpdatedBookingSchema,
} from "../../../schemas/member/booking.schema";
import { validateData } from "../../../utils/validation.utils";

const MemberBookingRoute = express.Router();

// Get Member Booking
// MemberBookingRoute.get("/", isAuthenticatedMember, GetMemberBooking);

// Create Booking (called when member is already logged in)
MemberBookingRoute.post(
  "/",
  validateData({ body: CreateBookingSchema }),
  CreateBooking
);

// Member Email Verification route for booking (when member is not logged in)
MemberBookingRoute.post(
  "/verify-member",
  validateData({ body: CreateBookingMemberNotLogin }),
  verifyEmailToCreateBooking
);

// Member Email OTP Verification route for booking (when member get the otp in email verification route)
MemberBookingRoute.post(
  "/verify-otp",
  validateData({ body: OTPVerificationSchemaForConfirmationBooking }),
  VerifyEmailOTPToConfirmBooking
);

// Resend otp to verify email and confirm the booking
MemberBookingRoute.post(
  "/resend-otp",
  validateData({ body: resendOTPBookingSchema }),
  resendOTPToVerifyEmailForBookingConfirmation
);

// Update booking route
MemberBookingRoute.put(
  "/:id",
  validateData({ params: UpdatedBookingIdSchema }),
  validateData({ body: UpdatedBookingSchema }),
  UpdateBooking
);

export default MemberBookingRoute;
