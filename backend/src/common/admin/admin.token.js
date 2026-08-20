"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAdmin = exports.generateTokenAdmin = exports.generateRefreshToken = exports.verifyRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../../config/env.config");
const verifyRefreshToken = (token) => {
    if (!env_config_1.envConfig.JWT.REFRESH_TOKEN_JWT_SECRET_ADMIN) {
        throw new Error("REFRESH_JWT_SECRET is not defined");
    }
    try {
        return jsonwebtoken_1.default.verify(token, env_config_1.envConfig.JWT.REFRESH_TOKEN_JWT_SECRET_ADMIN);
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateRefreshToken = (admin) => {
    if (!env_config_1.envConfig.JWT.REFRESH_TOKEN_JWT_SECRET_ADMIN) {
        throw new Error("REFRESH_JWT_SECRET is not defined in environment variables");
    }
    const options = {
        expiresIn: env_config_1.envConfig.JWT.REFRESH_TOKEN_JWT_EXPIRES_TIME_ADMIN || "15m",
    };
    return jsonwebtoken_1.default.sign({ admin }, env_config_1.envConfig.JWT.REFRESH_TOKEN_JWT_SECRET_ADMIN, options);
};
exports.generateRefreshToken = generateRefreshToken;
const generateTokenAdmin = (user) => {
    if (!env_config_1.envConfig.JWT.JWT_SECRET_ADMIN) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const options = {
        expiresIn: env_config_1.envConfig.JWT.JWT_TOKEN_EXPIRES_TIME_ADMIN || "7h",
    };
    return jsonwebtoken_1.default.sign({ user }, env_config_1.envConfig.JWT.JWT_SECRET_ADMIN, options);
};
exports.generateTokenAdmin = generateTokenAdmin;
const verifyTokenAdmin = (token) => {
    if (!env_config_1.envConfig.JWT.JWT_SECRET_ADMIN) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
        return jsonwebtoken_1.default.verify(token, env_config_1.envConfig.JWT.JWT_SECRET_ADMIN);
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.verifyTokenAdmin = verifyTokenAdmin;
