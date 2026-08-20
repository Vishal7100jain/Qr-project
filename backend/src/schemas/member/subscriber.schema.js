"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberSubscriberSchema = void 0;
const zod_1 = require("zod");
exports.MemberSubscriberSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email format" })
        .min(5, { message: "Email must be at least 5 characters long" }),
});
