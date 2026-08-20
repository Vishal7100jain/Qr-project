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
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (req_1, res_1, data_1, message_1, ...args_1) => __awaiter(void 0, [req_1, res_1, data_1, message_1, ...args_1], void 0, function* (req, res, data, message, statusCode = 200) {
    req.moduleDescription = message;
    return res.status(statusCode).json({ data, message, status: "success" });
});
exports.sendSuccess = sendSuccess;
const sendError = (req_1, res_1, message_1, ...args_1) => __awaiter(void 0, [req_1, res_1, message_1, ...args_1], void 0, function* (req, res, message, stateCode = 500, error) {
    req.moduleDescription = error ? error === null || error === void 0 ? void 0 : error.message : message;
    return res
        .status(stateCode)
        .json({ message: message, status: "error", error });
});
exports.sendError = sendError;
