"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryByNameSchema = exports.getUserHistorySchema = exports.createHistorySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const chartsEnum_1 = require("../../constants/chartsEnum");
// Utility for ObjectId validation
const objectIdSchema = zod_1.z
    .string({ required_error: "ID is required" })
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
});
// Option Leg Schema
const optionLegSchema = zod_1.z.object({
    optionType: zod_1.z.nativeEnum(chartsEnum_1.optionTypeEnum, {
        required_error: "Option type is required (Call/Put)",
    }),
    strikePrice: zod_1.z
        .number({
        required_error: "Strike price is required",
        invalid_type_error: "Strike price must be a number",
    })
        .positive("Strike price must be positive"),
    action: zod_1.z.nativeEnum(chartsEnum_1.actionEnum, {
        required_error: "Action is required (Buy/Sell)",
    }),
    premium: zod_1.z.number({
        required_error: "Premium is required",
        invalid_type_error: "Premium must be a number",
    }),
    quantity: zod_1.z
        .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
    })
        .int("Quantity must be an integer")
        .positive("Quantity must be positive"),
});
// Result Sub-Schema
const resultSchema = zod_1.z.object({
    breakevenPoints: zod_1.z.object({
        upper: zod_1.z.number({
            required_error: "Upper breakeven is required",
            invalid_type_error: "Upper breakeven must be a number",
        }),
        lower: zod_1.z.number({
            required_error: "Lower breakeven is required",
            invalid_type_error: "Lower breakeven must be a number",
        }),
    }, { required_error: "Breakeven points are required" }),
    NPRWithQty: zod_1.z.number({
        required_error: "NPRWithQty is required",
        invalid_type_error: "NPRWithQty must be a number",
    }),
    NPRWithoutQty: zod_1.z.number({
        required_error: "NPRWithoutQty is required",
        invalid_type_error: "NPRWithoutQty must be a number",
    }),
    maxProfit: zod_1.z.number({
        required_error: "Max profit is required",
        invalid_type_error: "Max profit must be a number",
    }),
    maxLoss: zod_1.z.number({
        required_error: "Max loss is required",
        invalid_type_error: "Max loss must be a number",
    }),
    riskRewardRatio: zod_1.z.number({
        required_error: "Risk reward ratio is required",
        invalid_type_error: "Risk reward ratio must be a number",
    }),
}, { required_error: "Result data is required" });
// Main Schemas for Routes
exports.createHistorySchema = zod_1.z.object({
    strategyName: zod_1.z.nativeEnum(chartsEnum_1.chartEnums, {
        required_error: "Strategy name is required",
    }),
    legs: zod_1.z
        .array(optionLegSchema, {
        required_error: "At least one option leg is required",
    })
        .min(1, "At least one option leg is required"),
    result: resultSchema,
    calculationName: zod_1.z.string({
        required_error: "Name of the calculation is required",
    }),
});
exports.getUserHistorySchema = zod_1.z.object({
    limit: zod_1.z.coerce
        .number({
        invalid_type_error: "Limit must be a number",
    })
        .int("Limit must be an integer")
        .positive("Limit must be positive")
        .max(100, "Maximum limit is 100")
        .default(10),
    page: zod_1.z.coerce
        .number({
        invalid_type_error: "Page must be a number",
    })
        .int("Page must be an integer")
        .positive("Page must be positive")
        .default(1),
});
exports.getHistoryByNameSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name of the chart is required" }),
});
