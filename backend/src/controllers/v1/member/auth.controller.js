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
exports.veryifyUserController = exports.userLogout = exports.SocialLogin = exports.GetUserLogin = exports.CreateNewUser = void 0;
const bcrypt_common_1 = require("../../../common/bcrypt.common");
const member_token_ts_1 = require("../../../common/member/member.token.ts");
const sender_common_1 = require("../../../common/sender.common");
const user_model_1 = require("../../../models/member/user.model");
const CreateNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const isUserAlreadyExists = yield user_model_1.User.findOne({ email: email });
        if (isUserAlreadyExists) {
            return (0, sender_common_1.sendError)(req, res, "Account already exist", 400);
        }
        const hashedPassword = yield (0, bcrypt_common_1.encryptPassword)(password);
        const newUser = new user_model_1.User({ username, email, password: hashedPassword });
        const savedUser = yield newUser.save();
        if (!savedUser)
            return (0, sender_common_1.sendError)(req, res, "Failed to Create an Account", 400);
        const modifiedUserData = {
            username: savedUser.username,
            email: savedUser.email,
            _id: savedUser._id,
        };
        const token = yield (0, member_token_ts_1.generateToken)(modifiedUserData);
        return (0, sender_common_1.sendSuccess)(req, res, { user: modifiedUserData, token }, "Account Created Successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            return (0, sender_common_1.sendError)(req, res, error.message, 500);
        }
    }
});
exports.CreateNewUser = CreateNewUser;
const GetUserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user)
            return (0, sender_common_1.sendError)(req, res, "Account not founded", 400);
        const comparePassword = yield (0, bcrypt_common_1.decryptPassword)(password, user.password);
        if (!comparePassword)
            return (0, sender_common_1.sendError)(req, res, "Invalid Password", 403);
        const modifiedUserData = {
            username: user.username,
            email: user.email,
            _id: user._id,
        };
        const token = yield (0, member_token_ts_1.generateToken)(modifiedUserData);
        return (0, sender_common_1.sendSuccess)(req, res, Object.assign(Object.assign({}, modifiedUserData), { token }), "Logged in Successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            return (0, sender_common_1.sendError)(req, res, error.message, 500);
        }
    }
});
exports.GetUserLogin = GetUserLogin;
const SocialLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, googleId, profilePhoto } = req.body;
    let userData = {};
    const [existingMember] = yield user_model_1.User.aggregate([
        {
            $match: {
                email: email,
            },
        },
        {
            $project: {
                password: 1,
                state: 1,
                username: 1,
                email: 1,
                profilePhoto: 1,
                _id: 1,
            },
        },
    ]);
    if (existingMember) {
        const token = (0, member_token_ts_1.generateToken)({
            username,
            email,
            _id: existingMember._id,
        });
        const modifiedData = { username, email, token, profilePhoto };
        return (0, sender_common_1.sendSuccess)(req, res, modifiedData, "Account founded");
    }
    if (username)
        userData.username = username;
    if (email)
        userData.email = email;
    if (googleId)
        userData.googleId = googleId;
    if (profilePhoto)
        userData.profilePhoto = profilePhoto;
    try {
        const newMember = new user_model_1.User(userData);
        yield newMember.save();
        const token = (0, member_token_ts_1.generateToken)({ username, email, _id: newMember._id });
        const modifiedData = {
            username,
            email,
            token,
            profilePhoto,
            _id: newMember._id,
        };
        if (!newMember)
            return (0, sender_common_1.sendError)(req, res, "failed to account", 400);
        return (0, sender_common_1.sendSuccess)(req, res, modifiedData, "account create Succesfully");
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, "failed to create account", 500);
    }
});
exports.SocialLogin = SocialLogin;
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, sender_common_1.sendSuccess)(req, res, {}, "user logout successfully");
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, "failed to logout user");
    }
});
exports.userLogout = userLogout;
const veryifyUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return (0, sender_common_1.sendSuccess)(req, res, {}, "Token Verified Successfully");
    }
    catch (error) {
        return (0, sender_common_1.sendError)(req, res, "Failed to verify user token");
    }
});
exports.veryifyUserController = veryifyUserController;
