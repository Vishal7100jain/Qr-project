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
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("../../constants/enums");
const OtpSchema = new mongoose_1.Schema({
    code: { type: Number, required: true },
    status: {
        type: Number,
        enum: enums_1.OtpStatus,
        default: enums_1.OtpStatus.ACTIVE,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    type: { type: Number, enum: enums_1.OtpType, required: true },
    memberId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true, // fixed typo: requried -> required
    },
}, {
    timestamps: true,
});
// Automatically set expiresAt to 10 minutes from now on creation
OtpSchema.pre("validate", function (next) {
    if (!this.expiresAt) {
        this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    }
    next();
});
OtpSchema.index({ memberId: 1 });
const OtpModel = (0, mongoose_1.model)("Otp", OtpSchema);
exports.default = OtpModel;
