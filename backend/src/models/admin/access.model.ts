import mongoose, { Document, Schema } from "mongoose";

export interface IAccessPermission extends Document {
  moduleName: string;
  permissions: ("view" | "create" | "edit" | "delete")[];
  createdBy: mongoose.Types.ObjectId;
  modifiedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AccessPermissionSchema = new Schema<IAccessPermission>(
  {
    moduleName: { type: String, required: true, unique: true },
    permissions: [
      {
        type: String,
        enum: ["view", "create", "edit", "delete"],
        required: true,
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

const AccessPermission = mongoose.model<IAccessPermission>(
  "AccessPermission",
  AccessPermissionSchema
);

export default AccessPermission;
