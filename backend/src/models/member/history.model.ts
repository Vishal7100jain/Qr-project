import mongoose, { Schema } from "mongoose";
import {
  actionEnum,
  chartEnums,
  optionTypeEnum,
} from "../../constants/chartsEnum";

interface IOptionLeg {
  optionType: optionTypeEnum;
  strikePrice: number;
  action: actionEnum;
  premium: number;
  quantity: number;
}

interface IBreakevenPoints {
  upper?: number;
  lower?: number;
}

interface IStrategyHistory {
  userId: string | mongoose.Types.ObjectId;
  strategyName: chartEnums;
  legs: IOptionLeg[];
  result: {
    breakevenPoints: IBreakevenPoints;
    NPRWithQty: number;
    NPRWithoutQty: number;
    maxProfit: number;
    maxLoss: number;
    riskRewardRatio: number;
  };
  calculatedAt?: Date | string;
  calculationName: string;
}

const historySchema = new Schema<IStrategyHistory>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  strategyName: {
    type: String,
    required: true,
    enum: chartEnums,
  },
  legs: [
    {
      optionType: { type: String, enum: optionTypeEnum },
      strikePrice: { type: Number, required: true },
      action: { type: String, enum: actionEnum },
      premium: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  result: {
    NPRWithQty: { type: Number }, // Credit (+) or Debit (-)
    NPRWithoutQty: { type: Number }, // Credit (+) or Debit (-)
    breakevenPoints: {
      upper: { type: Number }, // For strategies with upside risk
      lower: { type: Number }, // For strategies with downside risk
    },
    maxProfit: { type: Number },
    maxLoss: { type: Number },
    riskRewardRatio: { type: Number },
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
  calculationName: {
    type: String,
    required: true,
  },
});

export const History = mongoose.model<IStrategyHistory>(
  "History",
  historySchema
);
