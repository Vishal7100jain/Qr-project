"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const admin_enums_1 = require("../../constants/admin.enums");
const loginHistorySchema = new mongoose_1.Schema({
    personId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    personType: {
        type: Number,
        enum: admin_enums_1.PersonTypeEnum,
        required: true,
    },
    loginAt: {
        type: Date,
        default: Date.now,
    },
    logoutAt: {
        type: Date,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    isActive: {
        type: Number,
        enum: admin_enums_1.AdminStatus,
        default: admin_enums_1.AdminStatus.ACTIVE,
    },
}, { timestamps: true });
// 🔍 For efficient lookups
loginHistorySchema.index({ personId: 1, personType: 1 });
const LoginHistory = (0, mongoose_1.model)("LoginHistory", loginHistorySchema);
exports.default = LoginHistory;
