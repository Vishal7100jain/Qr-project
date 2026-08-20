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
exports.handleUpdateCreatedSendOTP = exports.handleSendOtp = void 0;
const fn_common_1 = require("../common/fn.common");
const smtp_config_1 = require("../config/smtp.config");
const enums_1 = require("../constants/enums");
const otp_model_1 = __importDefault(require("../models/member/otp.model"));
const handleSendOtp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ status, type, memberId, email, }) {
    const code = (0, fn_common_1.generateOtp)();
    const newOtp = new otp_model_1.default({
        code,
        status,
        type,
        memberId,
    });
    // Save OTP now, send email later — don't block response
    yield newOtp.save();
    // Email sending (non-blocking)
    yield smtp_config_1.emailService.sendOTP(email, code).catch((err) => {
        console.error("Failed to send OTP email:", err.message);
    });
});
exports.handleSendOtp = handleSendOtp;
const handleUpdateCreatedSendOTP = (_a) => __awaiter(void 0, [_a], void 0, function* ({ existingMember, email, }) {
    try {
        yield otp_model_1.default.updateMany({ memberId: existingMember._id, status: enums_1.OtpStatus.ACTIVE }, { $set: { status: enums_1.OtpStatus.CLOSED } });
        yield (0, exports.handleSendOtp)({
            status: enums_1.OtpStatus.ACTIVE,
            type: enums_1.OtpType.email,
            memberId: String(existingMember._id),
            email,
        });
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.handleUpdateCreatedSendOTP = handleUpdateCreatedSendOTP;
