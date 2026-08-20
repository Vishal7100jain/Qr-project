import { NextFunction, Request, Response } from "express";
import { UserJwtPayload } from "jsonwebtoken";
import { IUser } from "../models/member/user.model";
import { verifyToken } from "./member/member.token.ts";
import { sendError } from "./sender.common";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      token: string;
    }
  }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return sendError(req, res, "Token is missing", 403);
    const data: any = verifyToken(token) as {
      userData: UserJwtPayload;
      error: null;
    };

    if (data.userData) {
      req.user = data.userData.user;
      req.token = data.userData.token;
      next();
    } else {
      return sendError(
        req,
        res,
        data?.error?.message || "Token is invalid",
        403
      );
    }
  } catch (error: any) {
    return sendError(req, res, error?.message);
  }
};
