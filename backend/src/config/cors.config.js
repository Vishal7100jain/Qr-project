"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = [
    "http://localhost:3000", // Your frontend URL
    // Add other allowed origins as needed
];
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-API-KEY",
        "X-API-SECRET",
        "X-Requested-With",
    ],
    credentials: true,
};
exports.default = (0, cors_1.default)(corsOptions);
