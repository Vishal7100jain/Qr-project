"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../../../controllers/v1/member/booking.controller");
const booking_schema_1 = require("../../../schemas/member/booking.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const MemberBookingRoute = express_1.default.Router();
// Get Member Booking
// MemberBookingRoute.get("/", isAuthenticatedMember, GetMemberBooking);
// Create Booking (called when member is already logged in)
MemberBookingRoute.post("/", (0, validation_utils_1.validateData)({ body: booking_schema_1.CreateBookingSchema }), booking_controller_1.CreateBooking);
// Member Email Verification route for booking (when member is not logged in)
MemberBookingRoute.post("/verify-member", (0, validation_utils_1.validateData)({ body: booking_schema_1.CreateBookingMemberNotLogin }), booking_controller_1.verifyEmailToCreateBooking);
// Member Email OTP Verification route for booking (when member get the otp in email verification route)
MemberBookingRoute.post("/verify-otp", (0, validation_utils_1.validateData)({ body: booking_schema_1.OTPVerificationSchemaForConfirmationBooking }), booking_controller_1.VerifyEmailOTPToConfirmBooking);
// Resend otp to verify email and confirm the booking
MemberBookingRoute.post("/resend-otp", (0, validation_utils_1.validateData)({ body: booking_schema_1.resendOTPBookingSchema }), booking_controller_1.resendOTPToVerifyEmailForBookingConfirmation);
// Update booking route
MemberBookingRoute.put("/:id", (0, validation_utils_1.validateData)({ params: booking_schema_1.UpdatedBookingIdSchema }), (0, validation_utils_1.validateData)({ body: booking_schema_1.UpdatedBookingSchema }), booking_controller_1.UpdateBooking);
exports.default = MemberBookingRoute;
