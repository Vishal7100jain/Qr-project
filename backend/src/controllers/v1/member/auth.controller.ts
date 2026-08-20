import { Request, Response } from "express";
import {
  decryptPassword,
  encryptPassword,
} from "../../../common/bcrypt.common";
import { generateToken } from "../../../common/member/member.token.ts";
import { sendError, sendSuccess } from "../../../common/sender.common";
import { User } from "../../../models/member/user.model";

export const CreateNewUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const isUserAlreadyExists = await User.findOne({ email: email });

    if (isUserAlreadyExists) {
      return sendError(req, res, "Account already exist", 400);
    }

    const hashedPassword = await encryptPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });

    const savedUser = await newUser.save();
    if (!savedUser)
      return sendError(req, res, "Failed to Create an Account", 400);

    const modifiedUserData = {
      username: savedUser.username,
      email: savedUser.email,
      _id: savedUser._id,
    };

    const token = await generateToken(modifiedUserData);
    return sendSuccess(
      req,
      res,
      { user: modifiedUserData, token },
      "Account Created Successfully"
    );
  } catch (error) {
    if (error instanceof Error) {
      return sendError(req, res, error.message, 500);
    }
  }
};

export const GetUserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return sendError(req, res, "Account not founded", 400);

    const comparePassword = await decryptPassword(password, user.password);

    if (!comparePassword) return sendError(req, res, "Invalid Password", 403);

    const modifiedUserData = {
      username: user.username,
      email: user.email,
      _id: user._id,
    };

    const token = await generateToken(modifiedUserData);

    return sendSuccess(
      req,
      res,
      { ...modifiedUserData, token },
      "Logged in Successfully"
    );
  } catch (error) {
    if (error instanceof Error) {
      return sendError(req, res, error.message, 500);
    }
  }
};

export const SocialLogin = async (req: Request, res: Response) => {
  const { username, email, googleId, profilePhoto } = req.body;

  let userData: any = {};

  const [existingMember] = await User.aggregate([
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
    const token = generateToken({
      username,
      email,
      _id: existingMember._id,
    });
    const modifiedData = { username, email, token, profilePhoto };
    return sendSuccess(req, res, modifiedData, "Account founded");
  }

  if (username) userData.username = username;
  if (email) userData.email = email;
  if (googleId) userData.googleId = googleId;
  if (profilePhoto) userData.profilePhoto = profilePhoto;

  try {
    const newMember = new User(userData);
    await newMember.save();
    const token = generateToken({ username, email, _id: newMember._id });
    const modifiedData = {
      username,
      email,
      token,
      profilePhoto,
      _id: newMember._id,
    };
    if (!newMember) return sendError(req, res, "failed to account", 400);
    return sendSuccess(req, res, modifiedData, "account create Succesfully");
  } catch (error) {
    return sendError(req, res, "failed to create account", 500);
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    return sendSuccess(req, res, {}, "user logout successfully");
  } catch (error) {
    return sendError(req, res, "failed to logout user");
  }
};

export const veryifyUserController = async (req: Request, res: Response) => {
  try {
    return sendSuccess(req, res, {}, "Token Verified Successfully");
  } catch (error) {
    return sendError(req, res, "Failed to verify user token");
  }
};
