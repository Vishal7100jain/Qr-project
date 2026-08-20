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
exports.getHistoryById = exports.getUserHistory = exports.createHistory = void 0;
const mongoose_1 = require("mongoose");
const sender_common_1 = require("../../../common/sender.common");
const history_model_1 = require("../../../models/member/history.model");
// POST - Save a new strategy calculation to history
const createHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { strategyName, legs, result, calculationName } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Basic validation
        if (!userId || !strategyName || !legs || !result) {
            return (0, sender_common_1.sendError)(req, res, "Missing required fields", 400);
        }
        // Validate legs structure (example)
        if (!Array.isArray(legs) || legs.length === 0) {
            return (0, sender_common_1.sendError)(req, res, "Invalid legs data", 400);
        }
        const newHistory = yield history_model_1.History.create({
            userId,
            strategyName,
            legs,
            result,
            calculationName,
        });
        return (0, sender_common_1.sendSuccess)(req, res, newHistory, "Calculation history stored successfully");
    }
    catch (error) {
        console.error("Error saving history:", error);
        return (0, sender_common_1.sendError)(req, res, "Internal server error");
    }
});
exports.createHistory = createHistory;
// GET - Fetch all history records for a user
const getUserHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongoose_1.Types.ObjectId(req.user._id.toString());
        const { limit = 10, page = 1 } = req.query; // User inputs
        const parsedLimit = Math.min(Number(limit), 100);
        const parsedPage = Math.max(Number(page), 1); // Min page 1
        const history = yield history_model_1.History.aggregate([
            // 1. Match user's docs,
            {
                $match: {
                    userId,
                },
            },
            // 2. Sort newest first
            { $sort: { calculatedAt: -1 } },
        ]);
        return (0, sender_common_1.sendSuccess)(req, res, history);
    }
    catch (error) {
        console.error("Error fetching history:", error);
        return (0, sender_common_1.sendError)(req, res, "Internal server error");
    }
});
exports.getUserHistory = getUserHistory;
// GET - Fetch a single history record by ID
const getHistoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        const searchQuery = {
            calculationName: { $regex: name, $options: "i" },
        };
        const record = yield history_model_1.History.aggregate([
            {
                $match: searchQuery,
            },
        ]);
        if (record.length === 0) {
            return (0, sender_common_1.sendSuccess)(req, res, [], "History record not found");
        }
        return (0, sender_common_1.sendSuccess)(req, res, record);
    }
    catch (error) {
        console.error("Error fetching history record:", error);
        return (0, sender_common_1.sendError)(req, res, "Internal server error");
    }
});
exports.getHistoryById = getHistoryById;
