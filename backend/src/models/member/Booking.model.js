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
const admin_enums_1 = require("../../constants/admin.enums");
const enums_1 = require("../../constants/enums");
const member_enums_1 = require("../../constants/member.enums");
const BookingSchema = new mongoose_1.Schema({
    serviceType: {
        type: Number,
        enum: member_enums_1.BookingType,
        required: true,
    },
    memberId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Member",
    },
    artistId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Artist",
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    preferredTime: {
        type: String,
        required: true,
    },
    occasionType: {
        type: String,
        required: true,
    },
    styles: {
        type: [String],
        required: true,
    },
    budget: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
    },
    additionalDetails: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Number,
        enum: member_enums_1.isVerifiedEnum,
        required: true,
    },
    isDeleted: {
        type: Number,
        enum: admin_enums_1.DeletedEnum,
        default: admin_enums_1.DeletedEnum.NOT_DELETED,
    },
    adminStatus: {
        type: Number,
        enum: enums_1.AdminBookingOrderStatus,
        default: enums_1.AdminBookingOrderStatus.PENDING,
    },
    artistStatus: {
        type: Number,
        enum: enums_1.ArtistBookingOrderStatus,
        default: enums_1.ArtistBookingOrderStatus.PENDING,
    },
    artistStatusDescription: {
        type: String,
        trim: true,
    },
    blacklistedArtistIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Artist",
        },
    ],
}, { timestamps: true });
// Indexes for better query performance
BookingSchema.index({ artistId: 1 });
BookingSchema.index({ memberId: 1 });
BookingSchema.index({ adminStatus: 1 });
const Booking = mongoose_1.default.model("Booking", BookingSchema);
exports.default = Booking;
