import express from "express";
import { verifyUser } from "../../../common/auth.token";
import {
  CreateNewUser,
  GetUserLogin,
  SocialLogin,
  userLogout,
  veryifyUserController,
} from "../../../controllers/v1/member/auth.controller";

const MemberAuthRoute = express.Router();

// Member Login api
MemberAuthRoute.post("/login", GetUserLogin);

// Member Signup api
MemberAuthRoute.post("/signup", CreateNewUser);

// Member oauth-login login api
MemberAuthRoute.post("/oauth-login", SocialLogin);

// Member Logout route
MemberAuthRoute.post("/logout", userLogout);

// Token verification route
MemberAuthRoute.get("/token-verify", verifyUser, veryifyUserController);

export default MemberAuthRoute;
