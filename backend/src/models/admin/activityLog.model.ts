import mongoose, { Document, Schema } from "mongoose";
import { RoleEnum } from "../../constants/enums";

export interface IActivityLog extends Document {
  pId: mongoose.Types.ObjectId;
  pRole: RoleEnum;
  mo: string;
  ac: string;
  des: string;
  url: string;
  ipAdd?: string;
  agent?: string;
  sC: number;
  tiToRes: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema: Schema = new Schema<IActivityLog>(
  {
    pId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    pRole: { type: Number, enum: RoleEnum, default: RoleEnum.ADMIN },
    mo: { type: String, required: true },
    ac: { type: String, required: true },
    des: { type: String, required: true },
    url: { type: String, required: true },
    ipAdd: String,
    agent: String,
    sC: { type: Number, required: true },
    tiToRes: { type: Number, required: true },
  },
  { timestamps: true }
);

// Indexes for faster querying
ActivityLogSchema.index({ pId: 1 });
ActivityLogSchema.index({ mo: 1 });
ActivityLogSchema.index({ ac: 1 });

export const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema
);
