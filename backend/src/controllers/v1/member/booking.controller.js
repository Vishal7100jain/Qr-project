"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBooking = exports.resendOTPToVerifyEmailForBookingConfirmation = exports.VerifyEmailOTPToConfirmBooking = exports.verifyEmailToCreateBooking = exports.CreateBooking = exports.GetMemberBooking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sender_common_1 = require("../../../common/sender.common");
const smtp_config_1 = require("../../../config/smtp.config");
const admin_enums_1 = require("../../../constants/admin.enums");
const enums_1 = require("../../../constants/enums");
const error_messages_1 = require("../../../constants/error.messages");
const member_enums_1 = require("../../../constants/member.enums");
const Booking_model_1 = __importDefault(require("../../../models/member/Booking.model"));
const member_model_1 = __importDefault(require("../../../models/member/member.model"));
const otp_model_1 = __importDefault(require("../../../models/member/otp.model"));
const member_utils_1 = require("../../../utils/member.utils");
const otp_utils_1 = require("../../../utils/otp.utils");
const handleBookingResponse = (data) => {
    return {
        serviceType: member_enums_1.BookingType[data === null || data === void 0 ? void 0 : data.serviceType],
        styles: data === null || data === void 0 ? void 0 : data.styles,
        budget: data === null || data === void 0 ? void 0 : data.budget,
        occasionType: data === null || data === void 0 ? void 0 : data.occasionType,
        appointmentDate: data === null || data === void 0 ? void 0 : data.appointmentDate,
        preferredTime: data === null || data === void 0 ? void 0 : data.preferredTime,
        location: data === null || data === void 0 ? void 0 : data.location,
        pincode: data === null || data === void 0 ? void 0 : data.pincode,
        additionalDetails: data === null || data === void 0 ? void 0 : data.additionalDetails,
        createdAt: data === null || data === void 0 ? void 0 : data.createdAt,
    };
};
// Get Member booking
const GetMemberBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const memberId = (_a = req === null || req === void 0 ? void 0 : req.member) === null || _a === void 0 ? void 0 : _a._id;
        const member = yield member_model_1.default.findById(memberId);
        if (!member) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.accountNotFound, 400);
        }
        const bookings = yield Booking_model_1.default.aggregate([
            {
                $match: {
                    memberId: mongoose_1.default.Types.ObjectId.createFromHexString(String(memberId)),
                    isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
                },
            },
            {
                $lookup: {
                    as: "artist",
                    from: "Artist",
                    foreignField: "_id",
                    localField: "artistId",
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    serviceType: 1,
                    artist: "$artist",
                    appointmentDate: 1,
                    preferredTime: 1,
                    occasionType: 1,
                    styles: 1,
                    budget: 1,
                    additionalDetails: { $ifNull: ["$additionalDetails", ""] },
                    status: "$adminStatus",
                    location: 1,
                    pincode: 1,
                    createdAt: 1,
                },
            },
        ]);
        return (0, sender_common_1.sendSuccess)(req, res, bookings, error_messages_1.CommonSuccessMessage.booking.getBooking);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.member.failedBookingCreation, 500);
    }
});
exports.GetMemberBooking = GetMemberBooking;
// Book a Mehndi or Nail Artist
const CreateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceType, email, location, pincode, appointmentDate, preferredTime, occasionType, styles, additionalDetails, budget, } = req.body;
        // ⚡ Lean for fast read
        const member = yield member_model_1.default.findOne({ email, isVerified: admin_enums_1.VerifiedEnum.VERIFIED }, "fullName email _id").lean();
        if (!member) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.accountNotFound, 400);
        }
        // ✅ Lean optimization applied inside checkBookingFullForMember if needed
        const isBookingFull = yield (0, member_utils_1.checkBookingFullForMember)(String(member._id));
        if (isBookingFull) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.bookingLimitReached, 400);
        }
        // ✅ Create and save booking
        const booking = new Booking_model_1.default({
            serviceType,
            memberId: member._id,
            appointmentDate,
            preferredTime,
            occasionType,
            styles,
            additionalDetails,
            isVerified: member_enums_1.isVerifiedEnum.VERIFIED,
            budget,
            location,
            pincode,
        });
        const savedBooking = yield booking.save();
        // ✅ Send email in background (non-blocking)
        smtp_config_1.emailService
            .sendBookingConfirmation({
            appointmentDate: savedBooking.appointmentDate,
            email: member.email,
            fullName: member.fullName,
            location,
            preferredTime: savedBooking.preferredTime,
            serviceType: savedBooking.serviceType === member_enums_1.BookingType.MEHNDI ? "Mehndi" : "Nail",
            styles: savedBooking.styles,
            budget,
            occasionType,
        }, error_messages_1.CommonSuccessMessage.booking.bookingSuccessful)
            .catch((err) => console.error("Booking confirmation email failed:", err.message));
        return (0, sender_common_1.sendSuccess)(req, res, handleBookingResponse(savedBooking), error_messages_1.CommonSuccessMessage.booking.bookingSuccessful);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.member.failedBookingCreation, 500);
    }
});
exports.CreateBooking = CreateBooking;
// email verification for Booking a Mehndi or Nail Artist
const verifyEmailToCreateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceType, fullName, email, phoneNumber, isAddressVerified, pincode, city, state, location, appointmentDate, preferredTime, occasionType, styles, additionalDetails, budget, } = req.body;
        let member = yield member_model_1.default.findOne({ email }, "isDeleted _id isVerified").lean();
        if (member === null || member === void 0 ? void 0 : member.isDeleted) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.accountDeleted, 400);
        }
        const booking = new Booking_model_1.default({
            serviceType,
            appointmentDate,
            preferredTime,
            occasionType,
            styles,
            additionalDetails,
            budget,
            location,
            pincode,
        });
        // 🆕 If member doesn't exist → create & send OTP (don't block response)
        if (!member) {
            const newMember = new member_model_1.default({
                fullName,
                email,
                phoneNumber,
                address: { location, pincode, city, state, isAddressVerified },
            });
            const savedMember = yield newMember.save();
            booking.isVerified = member_enums_1.isVerifiedEnum.NOT_VERIFIED;
            booking.memberId = savedMember._id;
            yield booking.save();
            // 🔄 Async OTP
            (0, otp_utils_1.handleSendOtp)({
                status: enums_1.OtpStatus.ACTIVE,
                type: enums_1.OtpType.email,
                memberId: String(savedMember._id),
                email,
            }).catch(console.error);
            return (0, sender_common_1.sendSuccess)(req, res, { isMemberVerified: false }, error_messages_1.CommonSuccessMessage.booking.otpSentForVerification);
        }
        // 📩 Unverified → Send OTP (async), save booking, respond fast
        if (!(member === null || member === void 0 ? void 0 : member.isVerified)) {
            booking.isVerified = member_enums_1.isVerifiedEnum.NOT_VERIFIED;
            booking.memberId = member._id;
            yield booking.save();
            (0, otp_utils_1.handleUpdateCreatedSendOTP)({
                email,
                existingMember: member,
            }).catch(console.error);
            return (0, sender_common_1.sendSuccess)(req, res, { isMemberVerified: false }, error_messages_1.CommonSuccessMessage.booking.otpSentForVerification);
        }
        // ✅ Check booking limit (assume internal lean is optimized)
        const isBookingFull = yield (0, member_utils_1.checkBookingFullForMember)(String(member._id));
        if (isBookingFull) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.bookingLimitReached, 400);
        }
        // ✅ Final Booking Save (verified user)
        booking.memberId = member._id;
        booking.isVerified = member_enums_1.isVerifiedEnum.VERIFIED;
        const savedBooking = yield booking.save();
        // ✅ Async Email sending
        smtp_config_1.emailService
            .sendBookingConfirmation({
            appointmentDate: savedBooking.appointmentDate,
            email,
            fullName,
            location,
            preferredTime: savedBooking.preferredTime,
            serviceType: savedBooking.serviceType === member_enums_1.BookingType.MEHNDI ? "Mehndi" : "Nail",
            styles: savedBooking.styles,
            budget,
            occasionType,
        }, error_messages_1.CommonSuccessMessage.booking.bookingSuccessful)
            .catch(console.error);
        return (0, sender_common_1.sendSuccess)(req, res, Object.assign(Object.assign({}, handleBookingResponse(savedBooking)), { isVerified: admin_enums_1.VerifiedEnum.VERIFIED }), error_messages_1.CommonSuccessMessage.booking.bookingSuccessful);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.member.failedBookingCreation, 500);
    }
});
exports.verifyEmailToCreateBooking = verifyEmailToCreateBooking;
// verify otp for confirmation of the booking
const VerifyEmailOTPToConfirmBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, emailOTP, location, occasionType, budget } = req.body;
        const member = yield member_model_1.default.findOne({
            email,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        });
        if (!member) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.accountNotFound, 404);
        }
        const otpData = yield otp_model_1.default.findOne({
            memberId: member === null || member === void 0 ? void 0 : member._id,
            code: emailOTP,
            status: enums_1.OtpStatus.ACTIVE,
            type: enums_1.OtpType.email,
        });
        if (!otpData) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.invalidOTP, 400);
        }
        // Mark OTP as expired
        if (new Date() > otpData.expiresAt) {
            otpData.status = enums_1.OtpStatus.EXPIRED;
            yield otpData.save();
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.expiredOTP, 400);
        }
        // Mark OTP as used
        otpData.status = enums_1.OtpStatus.USED;
        yield otpData.save();
        member.isVerified = admin_enums_1.VerifiedEnum.VERIFIED;
        member.isVerifiedEmail = admin_enums_1.VerifiedEnum.VERIFIED;
        member.isVerifiedNumber = admin_enums_1.VerifiedEnum.VERIFIED;
        yield member.save();
        const existingUnVerifiedBooking = yield Booking_model_1.default.findOne({
            memberId: member._id,
            isVerified: admin_enums_1.VerifiedEnum.NOT_VERIFIED,
            budget,
        });
        if (!existingUnVerifiedBooking) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.failedBookingCreation);
        }
        existingUnVerifiedBooking.isVerified = member_enums_1.isVerifiedEnum.VERIFIED;
        const savedBooking = yield existingUnVerifiedBooking.save();
        smtp_config_1.emailService.sendBookingConfirmation({
            appointmentDate: savedBooking.appointmentDate,
            email: member === null || member === void 0 ? void 0 : member.email,
            fullName: member === null || member === void 0 ? void 0 : member.fullName,
            location,
            preferredTime: savedBooking.preferredTime,
            serviceType: savedBooking.serviceType === member_enums_1.BookingType.MEHNDI ? "Mehndi" : "Nail",
            styles: savedBooking.styles,
            budget,
            occasionType,
        }, error_messages_1.CommonSuccessMessage.booking.bookingSuccessful);
        return (0, sender_common_1.sendSuccess)(req, res, handleBookingResponse(existingUnVerifiedBooking), error_messages_1.CommonSuccessMessage.booking.bookingSuccessful);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.member.otpVerificationFailed, 500);
    }
});
exports.VerifyEmailOTPToConfirmBooking = VerifyEmailOTPToConfirmBooking;
// resend otp to verify email for confirmation of booking
const resendOTPToVerifyEmailForBookingConfirmation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.emailRequiredForOTP, 400);
        }
        const member = yield member_model_1.default.findOne({
            email,
        }, "isVerified isDeleted _id").lean();
        if (!member) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.accountNotFound, 400);
        }
        if (member === null || member === void 0 ? void 0 : member.isDeleted) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.accountDeleted, 400);
        }
        if (member === null || member === void 0 ? void 0 : member.isVerified) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.accountAlreadyVerified, 400);
        }
        (0, otp_utils_1.handleUpdateCreatedSendOTP)({ email, existingMember: member });
        return (0, sender_common_1.sendSuccess)(req, res, {}, error_messages_1.CommonSuccessMessage.otpResent);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.member.resendOTPFailed, 500);
    }
});
exports.resendOTPToVerifyEmailForBookingConfirmation = resendOTPToVerifyEmailForBookingConfirmation;
// Update booking
const UpdateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const allowedFields = [
            "serviceType",
            "location",
            "appointmentDate",
            "preferredTime",
            "occasionType",
            "styles",
            "additionalDetails",
            "budget",
            "pincode",
            "adminStatus",
        ];
        const hasValidField = allowedFields.some((field) => req.body[field] != null && req.body[field] !== "");
        if (!hasValidField) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.oneOfFieldReqBU);
        }
        const booking = yield Booking_model_1.default.findOne({ _id: id, isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED }, "adminStatus memberId").populate("memberId", "email fullName");
        if (!booking) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.bookingNotFound, 400);
        }
        if (booking.adminStatus === enums_1.AdminBookingOrderStatus.COMPLETED ||
            booking.adminStatus === enums_1.AdminBookingOrderStatus.CANCELLED) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.completedCancelBU, 400);
        }
        // Build the update object only with valid fields
        const updatedData = {};
        allowedFields.forEach((field) => {
            const value = req.body[field];
            if (value !== undefined && value !== null && value !== "") {
                updatedData[field] = value;
            }
        });
        // Update
        const updatedBooking = yield Booking_model_1.default.findByIdAndUpdate(id, { $set: updatedData }, { new: true, lean: true });
        if (!updatedBooking) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.member.failedBookingUpdated);
        }
        // Email notification (non-blocking)
        if ((_a = booking === null || booking === void 0 ? void 0 : booking.memberId) === null || _a === void 0 ? void 0 : _a.email) {
            smtp_config_1.emailService.sendBookingConfirmation({
                type: "updated",
                appointmentDate: updatedBooking.appointmentDate,
                email: booking.memberId.email,
                fullName: booking.memberId.fullName,
                location: updatedBooking.location,
                preferredTime: updatedBooking.preferredTime,
                serviceType: updatedBooking.serviceType === member_enums_1.BookingType.MEHNDI
                    ? "Mehndi"
                    : "Nail",
                styles: updatedBooking.styles,
                budget: updatedBooking.budget,
                occasionType: updatedBooking.occasionType,
            }, error_messages_1.CommonSuccessMessage.booking.bookingUpdatedSuccessful);
        }
        return (0, sender_common_1.sendSuccess)(req, res, handleBookingResponse(updatedBooking), error_messages_1.CommonSuccessMessage.booking.bookingSuccessful);
    }
    catch (error) {
        console.error("UpdateBooking error:", error);
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.member.failedBookingUpdated, 500);
    }
});
exports.UpdateBooking = UpdateBooking;
