"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commingSoon_controller_1 = require("../../../controllers/v1/member/commingSoon.controller");
const subscriber_schema_1 = require("../../../schemas/member/subscriber.schema");
const validation_utils_1 = require("../../../utils/validation.utils");
const MemberComingSoonRouter = express_1.default.Router();
// OTP Verfity for sign up
MemberComingSoonRouter.post("/", (0, validation_utils_1.validateData)({ body: subscriber_schema_1.MemberSubscriberSchema }), commingSoon_controller_1.subscribeMember);
exports.default = MemberComingSoonRouter;
