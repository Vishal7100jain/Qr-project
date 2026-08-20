import mongoose, { Schema } from "mongoose";
import { DeletedEnum, StatusEnum } from "../../constants/admin.enums";
import { PlanTypeEnum } from "../../constants/enums";

export interface IPlan {
  planType: PlanTypeEnum;
  planName: string;
  slug: string;
  price: {
    monthly: number;
    yearly: number;
  };
  discount: {
    monthly: { amount: number; percentage: number };
    yearly: { amount: number; percentage: number };
  };
  limits: {
    maxPortfolio?: number;
    maxImagesPerPortfolio?: number;
  };
  status: StatusEnum;
  isDeleted: DeletedEnum;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy: mongoose.Types.ObjectId;
}

export interface IPlanFeature extends Document {
  feature: string;
  planIds: mongoose.Types.ObjectId[];
  status: StatusEnum;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy: mongoose.Types.ObjectId;
}

export interface IPlanFAQ extends Document {
  question: string;
  answer: string;
  planIds: mongoose.Types.ObjectId[];
  status: StatusEnum;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy: mongoose.Types.ObjectId;
}

const PlanSchema = new Schema<IPlan>(
  {
    planType: {
      type: Number,
      enum: PlanTypeEnum,
      required: true,
    },
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      monthly: {
        type: Number,
        required: true,
      },
      yearly: {
        type: Number,
        required: true,
      },
    },
    discount: {
      monthly: {
        amount: { type: Number, required: true },
        percentage: { type: Number, required: true },
      },
      yearly: {
        amount: { type: Number, required: true },
        percentage: { type: Number, required: true },
      },
    },
    limits: {
      maxPortfolio: { type: Number, required: true },
      maxImagesPerPortfolio: { type: Number, required: true },
    },
    status: {
      type: Number,
      enum: StatusEnum,
      default: StatusEnum.ACTIVE,
    },
    isDeleted: {
      type: Number,
      enum: DeletedEnum,
      default: DeletedEnum.NOT_DELETED,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

const PlanFeatureSchema = new Schema<IPlanFeature>(
  {
    feature: {
      type: String,
      required: true,
      trim: true,
    },
    planIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "Plan",
    },
    status: {
      type: Number,
      enum: StatusEnum,
      default: StatusEnum.ACTIVE,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

const PlanFAQSchema = new Schema<IPlanFAQ>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    planIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "Plan",
    },
    status: {
      type: Number,
      enum: StatusEnum,
      default: StatusEnum.ACTIVE,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

PlanFeatureSchema.index({ planId: 1 });
PlanFAQSchema.index({ planId: 1 });

export const Plans = mongoose.model<IPlan>("Plan", PlanSchema);
export const PlanFeature = mongoose.model<IPlanFeature>(
  "PlanFeature",
  PlanFeatureSchema
);
export const PlanFAQ = mongoose.model<IPlanFAQ>("PlanFAQ", PlanFAQSchema);
