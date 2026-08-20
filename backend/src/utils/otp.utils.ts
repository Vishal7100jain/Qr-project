import { generateOtp } from "../common/fn.common";
import { emailService } from "../config/smtp.config";
import { OtpStatus, OtpType } from "../constants/enums";
import { IMember } from "../models/member/member.model";
import OtpModel from "../models/member/otp.model";
export const handleSendOtp = async ({
  status,
  type,
  memberId,
  email,
}: {
  status: number;
  type: number;
  memberId: string;
  email: string;
}) => {
  const code = generateOtp();

  const newOtp = new OtpModel({
    code,
    status,
    type,
    memberId,
  });

  // Save OTP now, send email later — don't block response
  await newOtp.save();

  // Email sending (non-blocking)
  await emailService.sendOTP(email, code).catch((err: any) => {
    console.error("Failed to send OTP email:", err.message);
  });
};

export const handleUpdateCreatedSendOTP = async ({
  existingMember,
  email,
}: {
  existingMember: IMember;
  email: string;
}) => {
  try {
    await OtpModel.updateMany(
      { memberId: existingMember._id, status: OtpStatus.ACTIVE },
      { $set: { status: OtpStatus.CLOSED } }
    );

    await handleSendOtp({
      status: OtpStatus.ACTIVE,
      type: OtpType.email,
      memberId: String(existingMember._id),
      email,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
