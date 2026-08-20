import { Document, model, Number, Schema } from "mongoose";
import { DeletedEnum, VerifiedEnum } from "../../constants/admin.enums";
import { AuthType, GenderEnum } from "../../constants/enums";

export interface IMember extends Document {
  fullName: string;
  email: string;
  phoneNumber?: Number;
  profilePic?: string;
  gender: Number;
  bio?: string;
  authType: AuthType;
  address?: string;
  socialAuthId?: string;
  isVerifiedEmail: VerifiedEnum;
  isVerifiedNumber: VerifiedEnum;
  isVerified: VerifiedEnum;
  isDeleted: DeletedEnum;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: Number, required: true, trim: true },
    profilePic: { type: String, default: "" },
    gender: { type: Number, enum: GenderEnum, default: GenderEnum.female },
    bio: { type: String, default: "" },
    socialAuthId: { type: String, default: "" },
    authType: {
      type: String,
      enum: AuthType,
      default: AuthType.CUSTOM,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      country: { type: String, trim: true },
      location: { type: String },
      isAddressVerified: { type: Boolean, default: false },
    },
    isVerifiedEmail: {
      type: Number,
      enum: VerifiedEnum,
      default: VerifiedEnum.NOT_VERIFIED,
    },
    isVerifiedNumber: {
      type: Number,
      enum: VerifiedEnum,
      default: VerifiedEnum.NOT_VERIFIED,
    },
    isVerified: {
      type: Number,
      enum: VerifiedEnum,
      default: VerifiedEnum.NOT_VERIFIED,
    },
    isDeleted: {
      type: Number,
      enum: DeletedEnum,
      default: DeletedEnum.NOT_DELETED,
    },
  },
  {
    timestamps: true,
  }
);

const Member = model<IMember>("Member", MemberSchema);
export default Member;
