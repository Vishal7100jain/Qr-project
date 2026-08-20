"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * Deletes a file from the uploads directory based on the provided path
 * @param filePath The relative path of the file to delete (e.g., '/admin-profile/filename.jpg')
 * @returns Promise<boolean> - true if deletion was successful, false otherwise
 */
const deleteFile = (filePath) => {
    if (filePath) {
        return new Promise((resolve) => {
            // Check if file exists
            if (!fs_1.default.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                return resolve(false);
            }
            // Delete the file
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${filePath}:`, err);
                    return resolve(false);
                }
                console.warn(`Successfully deleted file: ${filePath}`);
                resolve(true);
            });
        });
    }
    return new Promise((resolve) => resolve(true));
};
exports.deleteFile = deleteFile;
