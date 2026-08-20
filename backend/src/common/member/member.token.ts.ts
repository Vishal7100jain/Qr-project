import jwt, { SignOptions, UserJwtPayload } from "jsonwebtoken";
import { envConfig } from "../../config/env.config";
import { IUser } from "../../models/member/user.model";

declare module "jsonwebtoken" {
  export interface UserJwtPayload extends JwtPayload {
    user: IUser;
  }
}

export const generateToken = (user: {
  username: string;
  email: string;
  _id: string;
}): string => {
  if (!envConfig.JWT.JWT_SECRET_MEMBER) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn: envConfig.JWT.JWT_TOKEN_EXPIRES_TIME_MEMBER || ("7h" as any),
  };

  return jwt.sign({ user }, envConfig.JWT.JWT_SECRET_MEMBER, options);
};

export const verifyToken = (
  token: string
): { error: Error | null; userData: UserJwtPayload | null } => {
  if (!envConfig.JWT.JWT_SECRET_MEMBER) {
    return { error: new Error("JWT_SECRET is not defined"), userData: null };
  }

  try {
    const userData = jwt.verify(
      token,
      envConfig.JWT.JWT_SECRET_MEMBER
    ) as UserJwtPayload;
    return { error: null, userData };
  } catch (error) {
    return { error: error as Error, userData: null };
  }
};
