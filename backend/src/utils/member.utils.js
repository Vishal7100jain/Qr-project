"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBookingFullForMember = exports.handleMemberLoginHistory = exports.handleMemberDataResponse = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../constants/enums");
const Booking_model_1 = __importDefault(require("../models/member/Booking.model"));
const memberLoginHistory_model_1 = __importDefault(require("../models/member/memberLoginHistory.model"));
const handleMemberDataResponse = ({ data, token, }) => {
    return {
        _id: data._id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profilePic: data.profilePic,
        address: data.address,
        gender: data.gender,
        bio: data.bio,
        token,
    };
};
exports.handleMemberDataResponse = handleMemberDataResponse;
const handleMemberLoginHistory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMemberLoginHistory = new memberLoginHistory_model_1.default(Object.assign({}, data));
        const saveMemberHistory = yield newMemberLoginHistory.save();
        return saveMemberHistory;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.handleMemberLoginHistory = handleMemberLoginHistory;
const checkBookingFullForMember = (memberId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isBookingFull = yield Booking_model_1.default.aggregate([
        {
            $match: {
                memberId: mongoose_1.default.Types.ObjectId.createFromHexString(memberId),
                adminStatus: {
                    $in: [
                        enums_1.AdminBookingOrderStatus.PENDING,
                        enums_1.AdminBookingOrderStatus.CONFIRMED,
                    ],
                },
            },
        },
        {
            $group: {
                _id: "$memberId",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                hasReachedLimit: { $gte: ["$count", 10] },
                count: "$count",
            },
        },
    ]);
    return ((_a = isBookingFull[0]) === null || _a === void 0 ? void 0 : _a.hasReachedLimit) || false;
});
exports.checkBookingFullForMember = checkBookingFullForMember;
