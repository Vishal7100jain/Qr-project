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
exports.subscribeMember = void 0;
const sender_common_1 = require("../../../common/sender.common");
const smtp_config_1 = require("../../../config/smtp.config");
const commingSoonSubscribe_model_1 = __importDefault(require("../../../models/member/commingSoonSubscribe.model"));
// Subscribe User For comming soon
const subscribeMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Validate email
        if (!email || !email.includes("@")) {
            return (0, sender_common_1.sendError)(req, res, "Please provide a valid email address", 400);
        }
        // Check if already subscribed
        const existingSubscriber = yield commingSoonSubscribe_model_1.default.findOne({ email });
        if (existingSubscriber) {
            return (0, sender_common_1.sendSuccess)(req, res, {}, "You're already subscribed!");
        }
        const newSubscriber = new commingSoonSubscribe_model_1.default({ email });
        yield newSubscriber.save();
        yield smtp_config_1.emailService.sendSubcribeEmail(email);
        return (0, sender_common_1.sendSuccess)(req, res, {}, "Thank you for subscribing! We'll notify you when we launch.");
    }
    catch (error) {
        console.error("Subscription error:", error);
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || "Failed to subscribe. Please try again later.", 500);
    }
});
exports.subscribeMember = subscribeMember;
