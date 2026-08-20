"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Define the base uploads directory
const UPLOADS_DIR = path_1.default.join(__dirname, "../../public");
const MEMBER_IMAGES_DIR = path_1.default.join(UPLOADS_DIR, "members");
// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
// Initialize directories
ensureDirectoryExists(UPLOADS_DIR);
ensureDirectoryExists(MEMBER_IMAGES_DIR);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, MEMBER_IMAGES_DIR);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path_1.default.extname(file.originalname);
        cb(null, fileName);
    },
});
const MemberStorage = (0, multer_1.default)({
    storage,
});
exports.default = MemberStorage;
