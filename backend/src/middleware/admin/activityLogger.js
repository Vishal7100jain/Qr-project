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
exports.memberActivityLogger = exports.adminActivityLogger = void 0;
const enums_1 = require("../../constants/enums");
const activityLog_model_1 = require("../../models/admin/activityLog.model");
const adminActivityLogger = (req, res, next) => {
    var _a, _b, _c;
    const start = Date.now();
    const ipAddress = (req === null || req === void 0 ? void 0 : req.ip) || ((_a = req === null || req === void 0 ? void 0 : req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress);
    const userAgent = (req === null || req === void 0 ? void 0 : req.headers["user-agent"]) || "";
    const url = ((_c = (_b = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _b === void 0 ? void 0 : _b.split("/api/v1/admin")) === null || _c === void 0 ? void 0 : _c[1]) || (req === null || req === void 0 ? void 0 : req.originalUrl);
    const action = req === null || req === void 0 ? void 0 : req.method;
    res.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (req.admin) {
                // Ensure admin is authenticated
                const module = req.moduleName ||
                    ((_a = url.split("/api/v1/admin/")[1]) === null || _a === void 0 ? void 0 : _a.split("/")[0]) ||
                    "unknown";
                const logData = {
                    pId: (_b = req.admin) === null || _b === void 0 ? void 0 : _b._id,
                    pRole: enums_1.RoleEnum.ADMIN,
                    mo: module,
                    ac: action,
                    des: (req === null || req === void 0 ? void 0 : req.moduleDescription) || `${action} action performed`,
                    url,
                    ipAdd: ipAddress,
                    agent: userAgent,
                    sC: res.statusCode,
                    tiToRes: Date.now() - start,
                };
                yield activityLog_model_1.ActivityLog.create(logData);
            }
        }
        catch (error) {
            console.error("Failed to save admin activity log:", error);
            // Consider adding proper error logging here
        }
    }));
    next();
};
exports.adminActivityLogger = adminActivityLogger;
const memberActivityLogger = (req, res, next) => {
    var _a, _b, _c;
    const start = Date.now();
    const ipAddress = (req === null || req === void 0 ? void 0 : req.ip) || ((_a = req === null || req === void 0 ? void 0 : req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress);
    const userAgent = (req === null || req === void 0 ? void 0 : req.headers["user-agent"]) || "";
    const url = ((_c = (_b = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _b === void 0 ? void 0 : _b.split("/api/v1")) === null || _c === void 0 ? void 0 : _c[1]) || (req === null || req === void 0 ? void 0 : req.originalUrl);
    const action = req === null || req === void 0 ? void 0 : req.method;
    res.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            // Ensure member is authenticated
            if (req.member) {
                const module = req.moduleName ||
                    ((_a = url.split("/api/v1/")[1]) === null || _a === void 0 ? void 0 : _a.split("/")[0]) ||
                    "unknown";
                const logData = {
                    pId: (_b = req.member) === null || _b === void 0 ? void 0 : _b._id,
                    pRole: enums_1.RoleEnum.MEMBER,
                    mo: module,
                    ac: action,
                    des: (req === null || req === void 0 ? void 0 : req.moduleDescription) || `${action} action performed`,
                    url,
                    ipAdd: ipAddress,
                    agent: userAgent,
                    sC: res.statusCode,
                    tiToRes: Date.now() - start,
                };
                yield activityLog_model_1.ActivityLog.create(logData);
            }
        }
        catch (error) {
            console.error("Failed to save member activity log:", error);
        }
    }));
    next();
};
exports.memberActivityLogger = memberActivityLogger;
