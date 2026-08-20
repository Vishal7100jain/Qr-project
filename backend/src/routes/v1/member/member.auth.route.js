"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_token_1 = require("../../../common/auth.token");
const auth_controller_1 = require("../../../controllers/v1/member/auth.controller");
const MemberAuthRoute = express_1.default.Router();
// Member Login api
MemberAuthRoute.post("/login", auth_controller_1.GetUserLogin);
// Member Signup api
MemberAuthRoute.post("/signup", auth_controller_1.CreateNewUser);
// Member oauth-login login api
MemberAuthRoute.post("/oauth-login", auth_controller_1.SocialLogin);
// Member Logout route
MemberAuthRoute.post("/logout", auth_controller_1.userLogout);
// Token verification route
MemberAuthRoute.get("/token-verify", auth_token_1.verifyUser, auth_controller_1.veryifyUserController);
exports.default = MemberAuthRoute;
