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
exports.PlanFAQ = exports.PlanFeature = exports.Plans = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const admin_enums_1 = require("../../constants/admin.enums");
const enums_1 = require("../../constants/enums");
const PlanSchema = new mongoose_1.Schema({
    planType: {
        type: Number,
        enum: enums_1.PlanTypeEnum,
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
        enum: admin_enums_1.StatusEnum,
        default: admin_enums_1.StatusEnum.ACTIVE,
    },
    isDeleted: {
        type: Number,
        enum: admin_enums_1.DeletedEnum,
        default: admin_enums_1.DeletedEnum.NOT_DELETED,
    },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", required: true },
    modifiedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });
const PlanFeatureSchema = new mongoose_1.Schema({
    feature: {
        type: String,
        required: true,
        trim: true,
    },
    planIds: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        required: true,
        ref: "Plan",
    },
    status: {
        type: Number,
        enum: admin_enums_1.StatusEnum,
        default: admin_enums_1.StatusEnum.ACTIVE,
    },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", required: true },
    modifiedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });
const PlanFAQSchema = new mongoose_1.Schema({
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
        type: [mongoose_1.default.Schema.Types.ObjectId],
        required: true,
        ref: "Plan",
    },
    status: {
        type: Number,
        enum: admin_enums_1.StatusEnum,
        default: admin_enums_1.StatusEnum.ACTIVE,
    },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", required: true },
    modifiedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Admin", required: true },
}, { timestamps: true });
PlanFeatureSchema.index({ planId: 1 });
PlanFAQSchema.index({ planId: 1 });
exports.Plans = mongoose_1.default.model("Plan", PlanSchema);
exports.PlanFeature = mongoose_1.default.model("PlanFeature", PlanFeatureSchema);
exports.PlanFAQ = mongoose_1.default.model("PlanFAQ", PlanFAQSchema);
