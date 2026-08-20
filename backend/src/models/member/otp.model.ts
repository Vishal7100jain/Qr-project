import mongoose, { Document, model, Schema } from "mongoose";
import { OtpStatus, OtpType } from "../../constants/enums";

export interface IOtp extends Document {
  code: Number;
  status: OtpStatus;
  expiresAt: Date;
  type: OtpType;
  memberId: mongoose.Schema.Types.ObjectId;
}

const OtpSchema = new Schema<IOtp>(
  {
    code: { type: Number, required: true },
    status: {
      type: Number,
      enum: OtpStatus,
      default: OtpStatus.ACTIVE,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    type: { type: Number, enum: OtpType, required: true },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // fixed typo: requried -> required
    },
  },
  {
    timestamps: true,
  }
);

// Automatically set expiresAt to 10 minutes from now on creation
OtpSchema.pre("validate", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }
  next();
});

OtpSchema.index({ memberId: 1 });

const OtpModel = model<IOtp>("Otp", OtpSchema);
export default OtpModel;
