import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { emailService } from "../../../config/smtp.config";
import { DeletedEnum, VerifiedEnum } from "../../../constants/admin.enums";
import {
  AdminBookingOrderStatus,
  OtpStatus,
  OtpType,
} from "../../../constants/enums";
import {
  CommonErrorMessage,
  CommonSuccessMessage,
} from "../../../constants/error.messages";
import { BookingType, isVerifiedEnum } from "../../../constants/member.enums";
import Booking, { IBooking } from "../../../models/member/Booking.model";
import Member from "../../../models/member/member.model";
import OtpModel from "../../../models/member/otp.model";
import { checkBookingFullForMember } from "../../../utils/member.utils";
import {
  handleSendOtp,
  handleUpdateCreatedSendOTP,
} from "../../../utils/otp.utils";

const handleBookingResponse = (data: IBooking) => {
  return {
    serviceType: BookingType[data?.serviceType],
    styles: data?.styles,
    budget: data?.budget,
    occasionType: data?.occasionType,
    appointmentDate: data?.appointmentDate,
    preferredTime: data?.preferredTime,
    location: data?.location,
    pincode: data?.pincode,
    additionalDetails: data?.additionalDetails,
    createdAt: data?.createdAt,
  };
};

// Get Member booking
export const GetMemberBooking = async (req: Request, res: Response) => {
  try {
    const memberId = req?.member?._id;

    const member = await Member.findById(memberId);
    if (!member) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.accountNotFound,
        400
      );
    }

    const bookings = await Booking.aggregate([
      {
        $match: {
          memberId: mongoose.Types.ObjectId.createFromHexString(
            String(memberId)
          ),
          isDeleted: DeletedEnum.NOT_DELETED,
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

    return sendSuccess(
      req,
      res,
      bookings,
      CommonSuccessMessage.booking.getBooking
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.member.failedBookingCreation,
      500
    );
  }
};

// Book a Mehndi or Nail Artist
export const CreateBooking = async (req: Request, res: Response) => {
  try {
    const {
      serviceType,
      email,
      location,
      pincode,
      appointmentDate,
      preferredTime,
      occasionType,
      styles,
      additionalDetails,
      budget,
    } = req.body;

    // ⚡ Lean for fast read
    const member = await Member.findOne(
      { email, isVerified: VerifiedEnum.VERIFIED },
      "fullName email _id"
    ).lean();

    if (!member) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.accountNotFound,
        400
      );
    }

    // ✅ Lean optimization applied inside checkBookingFullForMember if needed
    const isBookingFull = await checkBookingFullForMember(String(member._id));
    if (isBookingFull) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.bookingLimitReached,
        400
      );
    }

    // ✅ Create and save booking
    const booking = new Booking({
      serviceType,
      memberId: member._id,
      appointmentDate,
      preferredTime,
      occasionType,
      styles,
      additionalDetails,
      isVerified: isVerifiedEnum.VERIFIED,
      budget,
      location,
      pincode,
    });

    const savedBooking = await booking.save();

    // ✅ Send email in background (non-blocking)
    emailService
      .sendBookingConfirmation(
        {
          appointmentDate: savedBooking.appointmentDate,
          email: member.email,
          fullName: member.fullName,
          location,
          preferredTime: savedBooking.preferredTime,
          serviceType:
            savedBooking.serviceType === BookingType.MEHNDI ? "Mehndi" : "Nail",
          styles: savedBooking.styles,
          budget,
          occasionType,
        },
        CommonSuccessMessage.booking.bookingSuccessful
      )
      .catch((err) =>
        console.error("Booking confirmation email failed:", err.message)
      );

    return sendSuccess(
      req,
      res,
      handleBookingResponse(savedBooking),
      CommonSuccessMessage.booking.bookingSuccessful
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.member.failedBookingCreation,
      500
    );
  }
};

// email verification for Booking a Mehndi or Nail Artist
export const verifyEmailToCreateBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      serviceType,
      fullName,
      email,
      phoneNumber,
      isAddressVerified,
      pincode,
      city,
      state,
      location,
      appointmentDate,
      preferredTime,
      occasionType,
      styles,
      additionalDetails,
      budget,
    } = req.body;

    let member: any = await Member.findOne(
      { email },
      "isDeleted _id isVerified"
    ).lean();
    if (member?.isDeleted) {
      return sendError(req, res, CommonErrorMessage.member.accountDeleted, 400);
    }

    const booking: any = new Booking({
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
      const newMember = new Member({
        fullName,
        email,
        phoneNumber,
        address: { location, pincode, city, state, isAddressVerified },
      });

      const savedMember = await newMember.save();
      booking.isVerified = isVerifiedEnum.NOT_VERIFIED;
      booking.memberId = savedMember._id;
      await booking.save();

      // 🔄 Async OTP
      handleSendOtp({
        status: OtpStatus.ACTIVE,
        type: OtpType.email,
        memberId: String(savedMember._id),
        email,
      }).catch(console.error);

      return sendSuccess(
        req,
        res,
        { isMemberVerified: false },
        CommonSuccessMessage.booking.otpSentForVerification
      );
    }

    // 📩 Unverified → Send OTP (async), save booking, respond fast
    if (!member?.isVerified) {
      booking.isVerified = isVerifiedEnum.NOT_VERIFIED;
      booking.memberId = member._id;
      await booking.save();

      handleUpdateCreatedSendOTP({
        email,
        existingMember: member,
      }).catch(console.error);

      return sendSuccess(
        req,
        res,
        { isMemberVerified: false },
        CommonSuccessMessage.booking.otpSentForVerification
      );
    }

    // ✅ Check booking limit (assume internal lean is optimized)
    const isBookingFull = await checkBookingFullForMember(String(member._id));
    if (isBookingFull) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.bookingLimitReached,
        400
      );
    }

    // ✅ Final Booking Save (verified user)
    booking.memberId = member._id;
    booking.isVerified = isVerifiedEnum.VERIFIED;
    const savedBooking = await booking.save();

    // ✅ Async Email sending
    emailService
      .sendBookingConfirmation(
        {
          appointmentDate: savedBooking.appointmentDate,
          email,
          fullName,
          location,
          preferredTime: savedBooking.preferredTime,
          serviceType:
            savedBooking.serviceType === BookingType.MEHNDI ? "Mehndi" : "Nail",
          styles: savedBooking.styles,
          budget,
          occasionType,
        },
        CommonSuccessMessage.booking.bookingSuccessful
      )
      .catch(console.error);

    return sendSuccess(
      req,
      res,
      {
        ...handleBookingResponse(savedBooking),
        isVerified: VerifiedEnum.VERIFIED,
      },
      CommonSuccessMessage.booking.bookingSuccessful
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.member.failedBookingCreation,
      500
    );
  }
};

// verify otp for confirmation of the booking
export const VerifyEmailOTPToConfirmBooking = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, emailOTP, location, occasionType, budget } = req.body;

    const member = await Member.findOne({
      email,
      isDeleted: DeletedEnum.NOT_DELETED,
    });

    if (!member) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.accountNotFound,
        404
      );
    }

    const otpData = await OtpModel.findOne({
      memberId: member?._id,
      code: emailOTP,
      status: OtpStatus.ACTIVE,
      type: OtpType.email,
    });

    if (!otpData) {
      return sendError(req, res, CommonErrorMessage.member.invalidOTP, 400);
    }

    // Mark OTP as expired
    if (new Date() > otpData.expiresAt) {
      otpData.status = OtpStatus.EXPIRED;
      await otpData.save();
      return sendError(req, res, CommonErrorMessage.member.expiredOTP, 400);
    }

    // Mark OTP as used
    otpData.status = OtpStatus.USED;
    await otpData.save();

    member.isVerified = VerifiedEnum.VERIFIED;
    member.isVerifiedEmail = VerifiedEnum.VERIFIED;
    member.isVerifiedNumber = VerifiedEnum.VERIFIED;
    await member.save();

    const existingUnVerifiedBooking = await Booking.findOne({
      memberId: member._id,
      isVerified: VerifiedEnum.NOT_VERIFIED,
      budget,
    });

    if (!existingUnVerifiedBooking) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.failedBookingCreation
      );
    }

    existingUnVerifiedBooking.isVerified = isVerifiedEnum.VERIFIED;
    const savedBooking = await existingUnVerifiedBooking.save();
    emailService.sendBookingConfirmation(
      {
        appointmentDate: savedBooking.appointmentDate,
        email: member?.email,
        fullName: member?.fullName,
        location,
        preferredTime: savedBooking.preferredTime,
        serviceType:
          savedBooking.serviceType === BookingType.MEHNDI ? "Mehndi" : "Nail",
        styles: savedBooking.styles,
        budget,
        occasionType,
      },
      CommonSuccessMessage.booking.bookingSuccessful
    );

    return sendSuccess(
      req,
      res,
      handleBookingResponse(existingUnVerifiedBooking),
      CommonSuccessMessage.booking.bookingSuccessful
    );
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.member.otpVerificationFailed,
      500
    );
  }
};

// resend otp to verify email for confirmation of booking
export const resendOTPToVerifyEmailForBookingConfirmation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.emailRequiredForOTP,
        400
      );
    }

    const member = await Member.findOne(
      {
        email,
      },
      "isVerified isDeleted _id"
    ).lean();

    if (!member) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.accountNotFound,
        400
      );
    }

    if (member?.isDeleted) {
      return sendError(req, res, CommonErrorMessage.member.accountDeleted, 400);
    }

    if (member?.isVerified) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.accountAlreadyVerified,
        400
      );
    }

    handleUpdateCreatedSendOTP({ email, existingMember: member as any });
    return sendSuccess(req, res, {}, CommonSuccessMessage.otpResent);
  } catch (error: any) {
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.member.resendOTPFailed,
      500
    );
  }
};

// Update booking
export const UpdateBooking = async (req: Request, res: Response) => {
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

    const hasValidField = allowedFields.some(
      (field) => req.body[field] != null && req.body[field] !== ""
    );
    if (!hasValidField) {
      return sendError(req, res, CommonErrorMessage.member.oneOfFieldReqBU);
    }

    const booking: any = await Booking.findOne(
      { _id: id, isDeleted: DeletedEnum.NOT_DELETED },
      "adminStatus memberId"
    ).populate("memberId", "email fullName");

    if (!booking) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.bookingNotFound,
        400
      );
    }

    if (
      booking.adminStatus === AdminBookingOrderStatus.COMPLETED ||
      booking.adminStatus === AdminBookingOrderStatus.CANCELLED
    ) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.completedCancelBU,
        400
      );
    }

    // Build the update object only with valid fields
    const updatedData: any = {};
    allowedFields.forEach((field) => {
      const value = req.body[field];
      if (value !== undefined && value !== null && value !== "") {
        updatedData[field] = value;
      }
    });

    // Update
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, lean: true }
    );

    if (!updatedBooking) {
      return sendError(
        req,
        res,
        CommonErrorMessage.member.failedBookingUpdated
      );
    }

    // Email notification (non-blocking)
    if (booking?.memberId?.email) {
      emailService.sendBookingConfirmation(
        {
          type: "updated",
          appointmentDate: updatedBooking.appointmentDate,
          email: booking.memberId.email,
          fullName: booking.memberId.fullName,
          location: updatedBooking.location,
          preferredTime: updatedBooking.preferredTime,
          serviceType:
            updatedBooking.serviceType === BookingType.MEHNDI
              ? "Mehndi"
              : "Nail",
          styles: updatedBooking.styles,
          budget: updatedBooking.budget,
          occasionType: updatedBooking.occasionType,
        },
        CommonSuccessMessage.booking.bookingUpdatedSuccessful
      );
    }

    return sendSuccess(
      req,
      res,
      handleBookingResponse(updatedBooking as any),
      CommonSuccessMessage.booking.bookingSuccessful
    );
  } catch (error: any) {
    console.error("UpdateBooking error:", error);
    return sendError(
      req,
      res,
      error?.message || CommonErrorMessage.member.failedBookingUpdated,
      500
    );
  }
};
