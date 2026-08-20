"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const chartsEnum_1 = require("../../constants/chartsEnum");
const historySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    strategyName: {
        type: String,
        required: true,
        enum: chartsEnum_1.chartEnums,
    },
    legs: [
        {
            optionType: { type: String, enum: chartsEnum_1.optionTypeEnum },
            strikePrice: { type: Number, required: true },
            action: { type: String, enum: chartsEnum_1.actionEnum },
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
exports.History = mongoose_1.default.model("History", historySchema);
