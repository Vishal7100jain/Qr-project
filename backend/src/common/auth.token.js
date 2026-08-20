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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const member_token_ts_1 = require("./member/member.token.ts");
const sender_common_1 = require("./sender.common");
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return (0, sender_common_1.sendError)(req, res, "Token is missing", 403);
        const data = (0, member_token_ts_1.verifyToken)(token);
        if (data.userData) {
            req.user = data.userData.user;
            req.token = data.userData.token;
            next();
        }
        else {
            return (0, sender_common_1.sendError)(req, res, ((_b = data === null || data === void 0 ? void 0 : data.error) === null || _b === void 0 ? void 0 : _b.message) || "Token is invalid", 403);
        }
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, error === null || error === void 0 ? void 0 : error.message);
    }
});
exports.verifyUser = verifyUser;
