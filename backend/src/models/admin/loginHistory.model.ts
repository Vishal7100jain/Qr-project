import mongoose, { model, Schema } from "mongoose";
import { AdminStatus, PersonTypeEnum } from "../../constants/admin.enums";

interface ILoginHistory {
  personId: mongoose.Types.ObjectId;
  personType: PersonTypeEnum;
  loginAt: Date;
  logoutAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: AdminStatus;
}

const loginHistorySchema = new Schema<ILoginHistory>(
  {
    personId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    personType: {
      type: Number,
      enum: PersonTypeEnum,
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
    isActive: {
      type: Number,
      enum: AdminStatus,
      default: AdminStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

// 🔍 For efficient lookups
loginHistorySchema.index({ personId: 1, personType: 1 });

const LoginHistory = model("LoginHistory", loginHistorySchema);
export default LoginHistory;
