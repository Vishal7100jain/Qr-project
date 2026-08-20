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
exports.GetBookings = void 0;
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const Booking_model_1 = __importDefault(require("../../../models/member/Booking.model"));
// Get Booking List
const GetBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.BOOKING_MANAGEMENT;
    try {
        // TODO : we have to add the artist email in this after the artist module get created artist status also
        const { page = 1, pageSize = 10, search = "", serviceType, memberEmail, pincode, adminStatus, appointmentDateFrom, appointmentDateTo, minBudget, maxBudget, } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        // Build filter object
        const filter = { isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED };
        // Search filter
        if (search) {
            const occasionTypeSearch = String(search).split(" ").join("_");
            filter.$or = [
                {
                    occasionType: {
                        $regex: occasionTypeSearch,
                        $options: "i",
                    },
                },
                { location: { $regex: search, $options: "i" } },
            ];
        }
        // Service type filter
        if (serviceType) {
            filter.serviceType = Number(serviceType);
        }
        // Pincode filter
        if (pincode) {
            filter.pincode = Number(pincode);
        }
        // // Artist status filter
        // if (artistStatus) {
        //   filter.artistStatus = Number(artistStatus);
        // }
        // Admin status filter
        if (adminStatus) {
            filter.adminStatus = Number(adminStatus);
        }
        // // Occasion type filter
        // if (occasionType) {
        //   filter.occasionType = { $regex: occasionType, $options: "i" };
        // }
        // Budget range filter
        if (minBudget || maxBudget) {
            if (minBudget && maxBudget) {
                filter.$and = [
                    { "budget.min": { $gte: Number(minBudget) } },
                    { "budget.max": { $lte: Number(maxBudget) } },
                ];
            }
            else if (minBudget) {
                filter["budget.min"] = { $gte: Number(minBudget) };
            }
            else if (maxBudget) {
                filter["budget.max"] = { $lte: Number(maxBudget) };
            }
        }
        // Appointment date range filter
        if (appointmentDateFrom || appointmentDateTo) {
            filter.appointmentDate = {};
            if (appointmentDateFrom) {
                filter.appointmentDate.$gte = new Date(appointmentDateFrom);
            }
            if (appointmentDateTo) {
                const endOfDay = new Date(appointmentDateTo);
                endOfDay.setHours(23, 59, 59, 999);
                filter.appointmentDate.$lte = endOfDay;
            }
        }
        const aggregationPipeline = [
            { $match: filter },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "members",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "member",
                },
            },
            { $unwind: { path: "$member", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "artists",
                    localField: "artistId",
                    foreignField: "_id",
                    as: "artist",
                },
            },
            { $unwind: { path: "$artist", preserveNullAndEmptyArrays: true } },
        ];
        // Artist email filter (after lookup)
        // if (artistEmail) {
        //   aggregationPipeline.push({
        //     $match: {
        //       "artist.email": { $regex: artistEmail as string, $options: "i" },
        //     },
        //   });
        // }
        // Member email filter (after lookup)
        if (memberEmail) {
            aggregationPipeline.push({
                $match: {
                    "member.email": { $regex: memberEmail, $options: "i" },
                },
            });
        }
        // Add facet for pagination
        aggregationPipeline.push({
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: Number(pageSize) },
                    {
                        $project: {
                            serviceType: 1,
                            appointmentDate: 1,
                            preferredTime: 1,
                            occasionType: 1,
                            styles: 1,
                            budget: 1,
                            location: 1,
                            pincode: 1,
                            additionalDetails: 1,
                            adminStatus: 1,
                            artistStatus: 1,
                            artistStatusDescription: 1,
                            isVerified: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            member: {
                                _id: "$member._id",
                                fullName: "$member.fullName",
                                email: "$member.email",
                                phoneNumber: "$member.phoneNumber",
                                profilePic: "$member.profilePic",
                                gender: "$member.gender",
                            },
                            // "artist.username": 1,
                            // "artist.email": 1,
                            // "artist.contactNumber": 1,
                            // "artist.profileImage": 1,
                        },
                    },
                ],
                total: [{ $count: "count" }],
            },
        });
        const result = yield Booking_model_1.default.aggregate(aggregationPipeline);
        const bookings = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: bookings,
            total,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.booking.bookingRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.booking.bookingFetchFailed, 500, error);
    }
});
exports.GetBookings = GetBookings;
