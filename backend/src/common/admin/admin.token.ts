import jwt, { SignOptions, UserJwtPayload } from "jsonwebtoken";
import { envConfig } from "../../config/env.config";
import { IMember } from "../../models/member/member.model";

declare module "jsonwebtoken" {
  export interface UserJwtPayload extends JwtPayload {
    member: IMember;
  }
}

export const verifyRefreshToken = (token: string) => {
  if (!envConfig.JWT.REFRESH_TOKEN_JWT_SECRET_ADMIN) {
    throw new Error("REFRESH_JWT_SECRET is not defined");
  }

  try {
    return jwt.verify(
      token,
      envConfig.JWT.REFRESH_TOKEN_JWT_SECRET_ADMIN
    ) as UserJwtPayload;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const generateRefreshToken = (admin: { _id: unknown }): string => {
  if (!envConfig.JWT.REFRESH_TOKEN_JWT_SECRET_ADMIN) {
    throw new Error(
      "REFRESH_JWT_SECRET is not defined in environment variables"
    );
  }

  const options: SignOptions = {
    expiresIn:
      envConfig.JWT.REFRESH_TOKEN_JWT_EXPIRES_TIME_ADMIN || ("15m" as any),
  };

  return jwt.sign(
    { admin },
    envConfig.JWT.REFRESH_TOKEN_JWT_SECRET_ADMIN,
    options
  );
};

export const generateTokenAdmin = (user: {
  email: string;
  _id: unknown;
}): string => {
  if (!envConfig.JWT.JWT_SECRET_ADMIN) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn: envConfig.JWT.JWT_TOKEN_EXPIRES_TIME_ADMIN || ("7h" as any),
  };

  return jwt.sign({ user }, envConfig.JWT.JWT_SECRET_ADMIN, options);
};

export const verifyTokenAdmin = (token: string) => {
  if (!envConfig.JWT.JWT_SECRET_ADMIN) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    return jwt.verify(token, envConfig.JWT.JWT_SECRET_ADMIN) as UserJwtPayload;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
