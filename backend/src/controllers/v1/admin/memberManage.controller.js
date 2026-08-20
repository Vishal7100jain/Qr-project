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
exports.GetMemberById = exports.DeleteMember = exports.UpdateMemberById = exports.GetMembers = exports.CreateMember = void 0;
const path_1 = __importDefault(require("path"));
const sender_common_1 = require("../../../common/sender.common");
const admin_enums_1 = require("../../../constants/admin.enums");
const error_messages_1 = require("../../../constants/error.messages");
const permissions_constants_1 = require("../../../constants/permissions.constants");
const member_model_1 = __importDefault(require("../../../models/member/member.model"));
const deleteFile_1 = require("../../../multer/deleteFile");
const loginHistory_utils_1 = require("../../../utils/loginHistory.utils");
// Create New Member
const CreateMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    req.moduleName = permissions_constants_1.ModuleName.MEMBER_MANAGEMENT;
    try {
        const { fullName, email, phoneNumber, street, city, state, pincode, country, isAddressVerified, gender, bio, } = req.body;
        const existingMember = yield member_model_1.default.findOne({ email }).lean();
        if (existingMember === null || existingMember === void 0 ? void 0 : existingMember.isDeleted) {
            (0, deleteFile_1.deleteFile)((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename);
            return (0, sender_common_1.sendError)(req, res, "This account is deleted");
        }
        if (existingMember === null || existingMember === void 0 ? void 0 : existingMember.isVerified) {
            (0, deleteFile_1.deleteFile)((_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.filename);
            return (0, sender_common_1.sendError)(req, res, "Account already exists", 400);
        }
        // 🔍 Check verified phone linked to someone else
        const verifiedWithPhone = yield member_model_1.default.findOne({
            email: { $ne: email },
            phoneNumber,
            isVerifiedNumber: admin_enums_1.VerifiedEnum.VERIFIED,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        }, "_id").lean();
        if (verifiedWithPhone) {
            (0, deleteFile_1.deleteFile)((_c = req === null || req === void 0 ? void 0 : req.file) === null || _c === void 0 ? void 0 : _c.filename);
            return (0, sender_common_1.sendError)(req, res, "Phone number in use", 400);
        }
        // ⚠️ Update phone if needed
        if ((existingMember === null || existingMember === void 0 ? void 0 : existingMember.phoneNumber) !== phoneNumber) {
            yield member_model_1.default.updateOne({ email }, { phoneNumber });
        }
        const newMember = new member_model_1.default({
            fullName,
            email,
            phoneNumber,
            address: { street, city, state, pincode, country, isAddressVerified },
            gender,
            bio,
            isVerified: admin_enums_1.VerifiedEnum.VERIFIED,
            isVerifiedEmail: admin_enums_1.VerifiedEnum.VERIFIED,
            isVerifiedNumber: admin_enums_1.VerifiedEnum.VERIFIED,
        });
        if ((_d = req.file) === null || _d === void 0 ? void 0 : _d.filename) {
            const fileName = (_e = req.file) === null || _e === void 0 ? void 0 : _e.filename;
            newMember.profilePic = `/members/${fileName}`;
        }
        const savedMember = yield newMember.save();
        return (0, sender_common_1.sendSuccess)(req, res, savedMember, "Member Created Successfully");
    }
    catch (error) {
        (0, deleteFile_1.deleteFile)((_f = req === null || req === void 0 ? void 0 : req.file) === null || _f === void 0 ? void 0 : _f.filename);
        (0, sender_common_1.sendError)(req, res, error.message);
    }
});
exports.CreateMember = CreateMember;
// Get All Members
const GetMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    req.moduleName = permissions_constants_1.ModuleName.MEMBER_MANAGEMENT;
    try {
        const { page = 1, pageSize = 10, status, search = "" } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const filter = {};
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (status !== undefined && status !== null) {
            filter.isVerified = { $eq: Number(status) };
        }
        const result = yield member_model_1.default.aggregate([
            { $match: Object.assign({}, filter) },
            { $sort: { createdAt: -1, updatedAt: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: Number(pageSize) },
                        {
                            $project: {
                                fullName: 1,
                                email: 1,
                                phoneNumber: 1,
                                profilePic: 1,
                                gender: 1,
                                bio: 1,
                                authType: 1,
                                address: 1,
                                socialAuthId: 1,
                                isVerifiedEmail: 1,
                                isVerifiedNumber: 1,
                                isVerified: 1,
                                isDeleted: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            },
                        },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);
        const members = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
        const total = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.total[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
        (0, sender_common_1.sendSuccess)(req, res, {
            data: members,
            total,
            page: Number(page),
            pageSize: Math.ceil(total / Number(pageSize)),
        }, error_messages_1.CommonSuccessMessage.admin.member.memberRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.member.fetchFailed, 500, error);
    }
});
exports.GetMembers = GetMembers;
// Update Member by Id
const UpdateMemberById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    req.moduleName = permissions_constants_1.ModuleName.MEMBER_MANAGEMENT;
    try {
        const hasBodyData = req.body &&
            Object.values(req.body).some((value) => value !== undefined && value !== null && value !== "");
        const hasFileData = (req === null || req === void 0 ? void 0 : req.file) && ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename);
        if (!hasBodyData && !hasFileData) {
            (0, deleteFile_1.deleteFile)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.management.oneFieldRequired, 400);
        }
        const { phoneNumber, email } = req.body;
        const { id } = req.params;
        const memberToUpdate = yield member_model_1.default.findById(id).lean();
        if (!memberToUpdate) {
            (0, deleteFile_1.deleteFile)((_c = req === null || req === void 0 ? void 0 : req.file) === null || _c === void 0 ? void 0 : _c.filename);
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.member.notFound, 400);
        }
        if (memberToUpdate === null || memberToUpdate === void 0 ? void 0 : memberToUpdate.isDeleted) {
            (0, deleteFile_1.deleteFile)((_d = req === null || req === void 0 ? void 0 : req.file) === null || _d === void 0 ? void 0 : _d.filename);
            return (0, sender_common_1.sendError)(req, res, "This account is deleted", 400);
        }
        // 🔍 Check phone linked to someone else
        if (phoneNumber) {
            const verifiedWithPhone = yield member_model_1.default.findOne({
                phoneNumber,
                email: { $ne: memberToUpdate === null || memberToUpdate === void 0 ? void 0 : memberToUpdate.email },
                isVerifiedNumber: admin_enums_1.VerifiedEnum.VERIFIED,
                isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
            }, "_id").lean();
            if (verifiedWithPhone) {
                (0, deleteFile_1.deleteFile)((_e = req === null || req === void 0 ? void 0 : req.file) === null || _e === void 0 ? void 0 : _e.filename);
                return (0, sender_common_1.sendError)(req, res, "Phone number in use", 400);
            }
        }
        // 🔍 Check email linked to someone else
        if (email) {
            const isEmailInUse = yield member_model_1.default.findOne({
                _id: { $ne: id },
                email,
                isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
            }, "_id").lean();
            if (isEmailInUse) {
                (0, deleteFile_1.deleteFile)((_f = req === null || req === void 0 ? void 0 : req.file) === null || _f === void 0 ? void 0 : _f.filename);
                return (0, sender_common_1.sendError)(req, res, "Email is already linked to verified account", 400);
            }
        }
        const updatedValue = {};
        Object.entries(req.body).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (key == "street" ||
                    key == "city" ||
                    key == "state" ||
                    key == "country" ||
                    key == "isAddressVerified") {
                    // Initialize address object if it doesn't exist
                    if (!updatedValue.address) {
                        updatedValue.address = {};
                    }
                    updatedValue.address[key] = value;
                }
                else {
                    updatedValue[key] = value;
                }
            }
        });
        // Preserve existing address fields that aren't being updated
        if (updatedValue.address && Object.keys(updatedValue.address).length > 0) {
            const existingAddress = memberToUpdate.address || {};
            updatedValue.address = Object.assign(Object.assign({}, existingAddress), updatedValue.address);
        }
        // deleting the old image
        if ((_g = req.file) === null || _g === void 0 ? void 0 : _g.filename) {
            const fullPath = path_1.default.join(process.cwd(), "public", String(memberToUpdate === null || memberToUpdate === void 0 ? void 0 : memberToUpdate.profilePic));
            (0, deleteFile_1.deleteFile)(fullPath);
            const fileName = (_h = req.file) === null || _h === void 0 ? void 0 : _h.filename;
            updatedValue.profilePic = `/members/${fileName}`;
        }
        const updatedMember = yield member_model_1.default.findByIdAndUpdate(id, {
            $set: Object.assign({}, updatedValue),
        }, { new: true, lean: true });
        if (!updatedMember) {
            (0, deleteFile_1.deleteFile)((_j = req === null || req === void 0 ? void 0 : req.file) === null || _j === void 0 ? void 0 : _j.filename);
            (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.member.updateFailed, 400);
        }
        return (0, sender_common_1.sendSuccess)(req, res, updatedMember, error_messages_1.CommonSuccessMessage.admin.member.updateSuccess);
    }
    catch (error) {
        (0, deleteFile_1.deleteFile)((_k = req === null || req === void 0 ? void 0 : req.file) === null || _k === void 0 ? void 0 : _k.filename);
        (0, sender_common_1.sendError)(req, res, error.message || error_messages_1.CommonErrorMessage.admin.member.updateFailed, 500);
    }
});
exports.UpdateMemberById = UpdateMemberById;
// Delete Member
const DeleteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.MEMBER_MANAGEMENT;
    try {
        const { id } = req.params;
        const memberToDelete = yield member_model_1.default.findOne({
            _id: id,
            isDeleted: admin_enums_1.DeletedEnum.NOT_DELETED,
        }).lean();
        if (!memberToDelete) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.member.notFound, 400);
        }
        // Update member isDeleted to 1 (delete)
        const deleteMember = yield member_model_1.default.findByIdAndUpdate(id, { $set: { isDeleted: admin_enums_1.DeletedEnum.DELETED } }, { new: true, lean: true }).lean();
        if (!deleteMember) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.member.deleteFailed);
        }
        // logout the member from it's active session
        (0, loginHistory_utils_1.UpdateMemberToLogout)({ memberIds: String(deleteMember === null || deleteMember === void 0 ? void 0 : deleteMember._id) });
        return (0, sender_common_1.sendSuccess)(req, res, deleteMember, error_messages_1.CommonSuccessMessage.admin.member.deleteSuccess);
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.member.deleteFailed, 500);
    }
});
exports.DeleteMember = DeleteMember;
// Get the Member by Id
const GetMemberById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.moduleName = permissions_constants_1.ModuleName.MEMBER_MANAGEMENT;
    try {
        const { id } = req.params;
        const member = yield member_model_1.default.findById(id).lean();
        if (!member) {
            return (0, sender_common_1.sendError)(req, res, error_messages_1.CommonErrorMessage.admin.member.notFound, 400);
        }
        (0, sender_common_1.sendSuccess)(req, res, member, error_messages_1.CommonSuccessMessage.admin.member.memberRetrieved);
    }
    catch (error) {
        (0, sender_common_1.sendError)(req, res, (error === null || error === void 0 ? void 0 : error.message) || error_messages_1.CommonErrorMessage.admin.member.notFound, 500, error);
    }
});
exports.GetMemberById = GetMemberById;
