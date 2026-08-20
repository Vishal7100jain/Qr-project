import mongoose, { Document, Schema, model } from "mongoose";
import { AuthType } from "../../constants/enums";

interface IMemberLoginHistory extends Document {
  oAuthProviderId?: string;
  memberId?: mongoose.Types.ObjectId;
  token: string;
  email: string;
  oAuthType: AuthType;
  loginAt: Date;
  logoutAt?: Date;
  isSuccessful: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const memberLoginSchema = new Schema<IMemberLoginHistory>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "member",
    },
    oAuthProviderId: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    oAuthType: {
      type: String,
      enum: Object.values(AuthType),
      required: true,
    },
    isSuccessful: {
      type: Boolean,
      required: true,
    },
    loginAt: {
      type: Date,
      default: Date.now,
    },
    logoutAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index to speed up lookups by user
memberLoginSchema.index({ email: 1 });
memberLoginSchema.index({ memberId: 1 });

const MemberLoginHistory = model<IMemberLoginHistory>(
  "memberloginhistory",
  memberLoginSchema
);

export default MemberLoginHistory;
