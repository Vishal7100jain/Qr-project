import mongoose, { Document, Schema } from "mongoose";
import { ModuleName } from "typescript";
import { PermissionType } from "../../constants/permissions.constants";

export interface IRole extends Document {
  name: string;
  permissions: { module: ModuleName; permissions: PermissionType[] };
  createdBy: mongoose.Types.ObjectId;
  modifiedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    access: [
      {
        module: { type: String, required: true },
        permissions: [{ type: String, required: true }],
      },
    ],
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

const Role = mongoose.model<IRole>("Role", RoleSchema);
export default Role;
