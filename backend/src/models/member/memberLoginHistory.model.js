"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enums_1 = require("../../constants/enums");
const memberLoginSchema = new mongoose_1.Schema({
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "member",
    },
    oAuthProviderId: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    oAuthType: {
        type: String,
        enum: Object.values(enums_1.AuthType),
        required: true,
    },
    isSuccessful: {
        type: Boolean,
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
}, {
    timestamps: true,
});
// Index to speed up lookups by user
memberLoginSchema.index({ email: 1 });
memberLoginSchema.index({ memberId: 1 });
const MemberLoginHistory = (0, mongoose_1.model)("memberloginhistory", memberLoginSchema);
exports.default = MemberLoginHistory;
