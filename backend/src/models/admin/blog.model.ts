import mongoose, { Document, Schema, Types } from "mongoose";
import { DeletedEnum } from "../../constants/admin.enums";
import { BlogStatus, BlogType, RoleEnum } from "../../constants/enums";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  description: string;
  tags: string[];
  status: BlogStatus;
  isDeleted: DeletedEnum;
  type: BlogType;
  thumbnail?: string;
  views: number;
  likes: number;
  comments?: string;
  contentLength: number;
  hasImage: boolean;
  createdByRole: RoleEnum;
  categoryId?: Types.ObjectId;
  approvedBy?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdByModel: string; // New field to track which model created the blog
  modifiedBy: Types.ObjectId;
  modifiedByModel: string; // New field to track which model modified the blog
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    description: String,
    tags: [String],
    status: {
      type: Number,
      enum: BlogStatus,
      default: BlogStatus.DRAFT,
    },
    isDeleted: {
      type: Number,
      enum: DeletedEnum,
      default: DeletedEnum.NOT_DELETED,
    },
    type: { type: Number, default: BlogType.normal },
    thumbnail: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: String },
    contentLength: { type: Number, default: 0 },
    hasImage: { type: Boolean, default: false },
    createdByRole: { type: Number, enum: RoleEnum, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "BlogCategory" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["Admin", "Artist"], // Specify which models can create blogs
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    modifiedByModel: {
      type: String,
      required: true,
      enum: ["Admin", "Artist"], // Specify which models can modify blogs
    },
  },
  { timestamps: true }
);

blogSchema.pre<IBlog>("save", function (next) {
  this.contentLength = this.content ? this.content.length : 0;
  this.hasImage = !!this.thumbnail;
  next();
});

// Virtual for populating createdBy based on the model type
blogSchema.virtual("createdByRef", {
  ref: function () {
    return this.createdByModel;
  },
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

// Virtual for populating modifiedBy based on the model type
blogSchema.virtual("modifiedByRef", {
  ref: function () {
    return this.modifiedByModel;
  },
  localField: "modifiedBy",
  foreignField: "_id",
  justOne: true,
});

// Apply virtuals when converting to JSON
blogSchema.set("toJSON", { virtuals: true });
// Apply virtuals when converting to Object
blogSchema.set("toObject", { virtuals: true });

const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
