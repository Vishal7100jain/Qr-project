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
exports.emailService = void 0;
// src/services/email.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const bookingConfirmation_html_1 = require("../email/bookingConfirmation-html");
const subscribe_html_1 = require("../email/subscribe-html");
class EmailService {
    constructor() {
        this.config = {
            // host: envConfig.EMAIL_CONFIG.server,
            // port: envConfig.EMAIL_CONFIG.port,
            secure: true,
            auth: {
            // user: envConfig.EMAIL_CONFIG.user,
            // pass: envConfig.EMAIL_CONFIG.password,
            },
            tls: {
                ciphers: "SSLv3",
            },
        };
        this.transporter = nodemailer_1.default.createTransport(this.config);
    }
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.verify();
                console.log("SMTP connection verified");
            }
            catch (error) {
                console.error("Error verifying SMTP connection:", error);
                throw error;
            }
        });
    }
    sendOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `${"envConfig.EMAIL_CONFIG.user"}`,
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
                html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
            };
            return this.sendMail(mailOptions);
        });
    }
    sendSubcribeEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `${"envConfig.EMAIL_CONFIG.user"}`,
                to: email,
                subject: "Thanks for subscribing ✨💚",
                html: (0, subscribe_html_1.SubscribeHTML)(),
            };
            return this.sendMail(mailOptions);
        });
    }
    sendBookingConfirmation(data, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `${"envConfig.EMAIL_CONFIG.user"}`,
                to: data === null || data === void 0 ? void 0 : data.email,
                subject,
                html: (0, bookingConfirmation_html_1.BookingConfirmationHTML)(Object.assign({}, data)),
            };
            return this.sendMail(mailOptions);
        });
    }
    sendMail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.sendMail(Object.assign({ from: `${"envConfig.EMAIL_CONFIG.user"}` }, options));
            }
            catch (error) {
                console.error("Error sending email:", error);
                throw new Error(`Failed to send email: ${error.message}`);
            }
        });
    }
}
// Initialize at server startup
exports.emailService = EmailService.getInstance();
