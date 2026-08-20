import crypto from "crypto";

export function generateOtp(): number {
  const otp = crypto.randomInt(100000, 1000000); // 100000 to 999999
  return otp;
}
