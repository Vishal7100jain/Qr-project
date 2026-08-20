"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../../config/env.config");
const generateToken = (user) => {
    if (!env_config_1.envConfig.JWT.JWT_SECRET_MEMBER) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const options = {
        expiresIn: env_config_1.envConfig.JWT.JWT_TOKEN_EXPIRES_TIME_MEMBER || "7h",
    };
    return jsonwebtoken_1.default.sign({ user }, env_config_1.envConfig.JWT.JWT_SECRET_MEMBER, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    if (!env_config_1.envConfig.JWT.JWT_SECRET_MEMBER) {
        return { error: new Error("JWT_SECRET is not defined"), userData: null };
    }
    try {
        const userData = jsonwebtoken_1.default.verify(token, env_config_1.envConfig.JWT.JWT_SECRET_MEMBER);
        return { error: null, userData };
    }
    catch (error) {
        return { error: error, userData: null };
    }
};
exports.verifyToken = verifyToken;
