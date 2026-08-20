import mongoose from "mongoose";
import { z } from "zod";
import {
  actionEnum,
  chartEnums,
  optionTypeEnum,
} from "../../constants/chartsEnum";

// Utility for ObjectId validation
const objectIdSchema = z
  .string({ required_error: "ID is required" })
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  });

// Option Leg Schema
const optionLegSchema = z.object({
  optionType: z.nativeEnum(optionTypeEnum, {
    required_error: "Option type is required (Call/Put)",
  }),
  strikePrice: z
    .number({
      required_error: "Strike price is required",
      invalid_type_error: "Strike price must be a number",
    })
    .positive("Strike price must be positive"),
  action: z.nativeEnum(actionEnum, {
    required_error: "Action is required (Buy/Sell)",
  }),
  premium: z.number({
    required_error: "Premium is required",
    invalid_type_error: "Premium must be a number",
  }),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .positive("Quantity must be positive"),
});

// Result Sub-Schema
const resultSchema = z.object(
  {
    breakevenPoints: z.object(
      {
        upper: z.number({
          required_error: "Upper breakeven is required",
          invalid_type_error: "Upper breakeven must be a number",
        }),
        lower: z.number({
          required_error: "Lower breakeven is required",
          invalid_type_error: "Lower breakeven must be a number",
        }),
      },
      { required_error: "Breakeven points are required" }
    ),
    NPRWithQty: z.number({
      required_error: "NPRWithQty is required",
      invalid_type_error: "NPRWithQty must be a number",
    }),
    NPRWithoutQty: z.number({
      required_error: "NPRWithoutQty is required",
      invalid_type_error: "NPRWithoutQty must be a number",
    }),
    maxProfit: z.number({
      required_error: "Max profit is required",
      invalid_type_error: "Max profit must be a number",
    }),
    maxLoss: z.number({
      required_error: "Max loss is required",
      invalid_type_error: "Max loss must be a number",
    }),
    riskRewardRatio: z.number({
      required_error: "Risk reward ratio is required",
      invalid_type_error: "Risk reward ratio must be a number",
    }),
  },
  { required_error: "Result data is required" }
);

// Main Schemas for Routes
export const createHistorySchema = z.object({
  strategyName: z.nativeEnum(chartEnums, {
    required_error: "Strategy name is required",
  }),
  legs: z
    .array(optionLegSchema, {
      required_error: "At least one option leg is required",
    })
    .min(1, "At least one option leg is required"),
  result: resultSchema,
  calculationName: z.string({
    required_error: "Name of the calculation is required",
  }),
});

export const getUserHistorySchema = z.object({
  limit: z.coerce
    .number({
      invalid_type_error: "Limit must be a number",
    })
    .int("Limit must be an integer")
    .positive("Limit must be positive")
    .max(100, "Maximum limit is 100")
    .default(10),
  page: z.coerce
    .number({
      invalid_type_error: "Page must be a number",
    })
    .int("Page must be an integer")
    .positive("Page must be positive")
    .default(1),
});

export const getHistoryByNameSchema = z.object({
  name: z.string({ required_error: "Name of the chart is required" }),
});
