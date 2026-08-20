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
exports.UpdateMemberToLogout = exports.updateLoginHistoryToLogout = exports.createLoginHistory = void 0;
const admin_enums_1 = require("../constants/admin.enums");
const loginHistory_model_1 = __importDefault(require("../models/admin/loginHistory.model"));
const memberLoginHistory_model_1 = __importDefault(require("../models/member/memberLoginHistory.model"));
/**
 * Creates a new admin login history record
 * @param personId - The ID of the admin who logged in
 * @param ipAddress - The IP address from which the admin logged in
 * @param userAgent - The user agent string of the admin's device
 * @returns Promise<ILoginHistory> - The created login history record
 */
const createLoginHistory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ personId, personType, ipAddress, userAgent, logoutAt, }) {
    try {
        yield loginHistory_model_1.default.create({
            personId,
            personType,
            ipAddress,
            userAgent,
            isActive: admin_enums_1.AdminStatus.ACTIVE,
            logoutAt,
        });
        return;
    }
    catch (error) {
        console.error("Error creating login history:", error);
        throw error;
    }
});
exports.createLoginHistory = createLoginHistory;
/**
 * Updates admin login history record(s) for logout
 * @param adminIds - Single ID or array of IDs of admins who logged out
 * @returns Promise<{
 *   successCount: number;
 *   failedCount: number;
 *   results: mongoose.UpdateWriteOpResult[];
 * }> - Summary of update operations
 */
const updateLoginHistoryToLogout = (_a) => __awaiter(void 0, [_a], void 0, function* ({ personIds, options = {}, }) {
    try {
        // Normalize to array
        const idsArray = Array.isArray(personIds) ? personIds : [personIds];
        const filter = {
            personId: { $in: idsArray },
            isActive: admin_enums_1.AdminStatus.ACTIVE,
        };
        const result = yield loginHistory_model_1.default.updateMany(filter, {
            $set: {
                logoutAt: new Date(),
                isActive: admin_enums_1.AdminStatus.INACTIVE,
            },
        }, { session: options === null || options === void 0 ? void 0 : options.session });
        return {
            successCount: result.modifiedCount,
            failedCount: idsArray.length - result.modifiedCount,
            results: [result],
        };
    }
    catch (error) {
        console.error("Error in bulk login history update:", error);
        throw error;
    }
});
exports.updateLoginHistoryToLogout = updateLoginHistoryToLogout;
const UpdateMemberToLogout = (_a) => __awaiter(void 0, [_a], void 0, function* ({ memberIds, options = {}, }) {
    try {
        // Normalize to array
        const idsArray = Array.isArray(memberIds) ? memberIds : [memberIds];
        const filter = {
            memberId: { $in: idsArray },
            isSuccessful: true,
        };
        const result = yield memberLoginHistory_model_1.default.updateMany(filter, {
            $set: {
                logoutAt: new Date(),
            },
        }, { session: options === null || options === void 0 ? void 0 : options.session });
        return {
            successCount: result.modifiedCount,
            failedCount: idsArray.length - result.modifiedCount,
            results: [result],
        };
    }
    catch (error) {
        console.error("Error in bulk login history update:", error);
        throw error;
    }
});
exports.UpdateMemberToLogout = UpdateMemberToLogout;
