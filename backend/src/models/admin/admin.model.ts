import mongoose, { Document, Schema } from "mongoose";
import { AdminStatus, DeletedEnum } from "../../constants/admin.enums";

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  contactNumber: string;
  roleId: mongoose.Types.ObjectId;
  status: AdminStatus;
  isDeleted: DeletedEnum;
  profileImage?: string;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Role",
    },
    status: {
      type: Number,
      enum: AdminStatus,
      default: AdminStatus.ACTIVE,
    },
    isDeleted: {
      type: Number,
      enum: DeletedEnum,
      default: DeletedEnum.NOT_DELETED,
    },
    profileImage: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

// Indexes
AdminSchema.index({ roleId: 1 });
AdminSchema.index({ status: 1 });

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;
