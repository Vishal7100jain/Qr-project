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
exports.GetCommingSoonSubscriber = void 0;
const sender_common_1 = require("../../../common/sender.common");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const commingSoonSubscribe_model_1 = __importDefault(require("../../../models/member/commingSoonSubscribe.model"));
// Get Comming soon subscriber list
const GetCommingSoonSubscriber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.COMMING_SOON_MANAGEMENT;
    try {
        const { page = 1, pageSize = 10, search = "" } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (search) {
            filter.$or = [{ email: { $regex: search, $options: "i" } }];
        }
        const result = yield commingSoonSubscribe_model_1.default.aggregate([
            { $match: Object.assign({}, filter) },
            { $sort: { createdAt: -1, updatedAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: Number(pageSize) },
                        {
                            $project: {
                                email: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);
        const member = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: member,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.CommingSoonSubs.comminSoon);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.CommingSoonSubs.comminSoon, 500, error);
    }
});
exports.GetCommingSoonSubscriber = GetCommingSoonSubscriber;
