"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Define the expected environment variables
const requiredEnvVars = [
    "NODE_ENV",
    "PORT",
    "MONGO_DB_URL",
    "ADMIN_X_API_KEY",
    "ADMIN_X_API_SECRET",
    "ADMIN_LOGOUT_TIME_SECOND",
    "JWT_SECRET_MEMBER",
    "JWT_TOKEN_EXPIRES_TIME_MEMBER",
    "JWT_SECRET_ADMIN",
    "JWT_TOKEN_EXPIRES_TIME_ADMIN",
    "REFRESH_TOKEN_JWT_SECRET_ADMIN",
    "REFRESH_TOKEN_JWT_EXPIRES_TIME_ADMIN",
];
// Define a type-safe config object
exports.envConfig = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT, 10),
    ADMIN_LOGOUT_TIME_SECOND: parseInt(process.env.ADMIN_LOGOUT_TIME_SECOND),
    DB: {
        MONGO_DB_URL: process.env.MONGO_DB_URL,
    },
    API_KEYS: {
        MEMBER_X_API_KEY: process.env.MEMBER_X_API_KEY,
        MEMBER_X_API_SECRET: process.env.MEMBER_X_API_SECRET,
        ADMIN_X_API_KEY: process.env.ADMIN_X_API_KEY,
        ADMIN_X_API_SECRET: process.env.ADMIN_X_API_SECRET,
    },
    JWT: {
        JWT_SECRET_MEMBER: process.env.JWT_SECRET_MEMBER,
        JWT_TOKEN_EXPIRES_TIME_MEMBER: process.env.JWT_TOKEN_EXPIRES_TIME_MEMBER,
        JWT_SECRET_ADMIN: process.env.JWT_SECRET_ADMIN,
        JWT_TOKEN_EXPIRES_TIME_ADMIN: process.env.JWT_TOKEN_EXPIRES_TIME_ADMIN,
        REFRESH_TOKEN_JWT_SECRET_ADMIN: process.env.REFRESH_TOKEN_JWT_SECRET_ADMIN,
        REFRESH_TOKEN_JWT_EXPIRES_TIME_ADMIN: process.env.REFRESH_TOKEN_JWT_EXPIRES_TIME_ADMIN,
    },
};
// Ensure all required variables are defined
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}
