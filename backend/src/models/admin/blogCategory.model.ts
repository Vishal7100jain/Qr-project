import mongoose, { Document, Schema } from "mongoose";
import { StatusEnum } from "../../constants/admin.enums";

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  description: string;
  status: StatusEnum;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<IBlogCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: {
      type: Number,
      enum: StatusEnum,
      default: StatusEnum.ACTIVE,
    },
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

const BlogCategory = mongoose.model<IBlogCategory>(
  "BlogCategory",
  categorySchema
);
export default BlogCategory;
