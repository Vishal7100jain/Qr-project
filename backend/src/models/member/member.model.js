"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const admin_enums_1 = require("../../constants/admin.enums");
const enums_1 = require("../../constants/enums");
const MemberSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: Number, required: true, trim: true },
    profilePic: { type: String, default: "" },
    gender: { type: Number, enum: enums_1.GenderEnum, default: enums_1.GenderEnum.female },
    bio: { type: String, default: "" },
    socialAuthId: { type: String, default: "" },
    authType: {
        type: String,
        enum: enums_1.AuthType,
        default: enums_1.AuthType.CUSTOM,
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        country: { type: String, trim: true },
        location: { type: String },
        isAddressVerified: { type: Boolean, default: false },
    },
    isVerifiedEmail: {
        type: Number,
        enum: admin_enums_1.VerifiedEnum,
        default: admin_enums_1.VerifiedEnum.NOT_VERIFIED,
    },
    isVerifiedNumber: {
        type: Number,
        enum: admin_enums_1.VerifiedEnum,
        default: admin_enums_1.VerifiedEnum.NOT_VERIFIED,
    },
    isVerified: {
        type: Number,
        enum: admin_enums_1.VerifiedEnum,
        default: admin_enums_1.VerifiedEnum.NOT_VERIFIED,
    },
    isDeleted: {
        type: Number,
        enum: admin_enums_1.DeletedEnum,
        default: admin_enums_1.DeletedEnum.NOT_DELETED,
    },
}, {
    timestamps: true,
});
const Member = (0, mongoose_1.model)("Member", MemberSchema);
exports.default = Member;
