import fs from "fs";
import multer from "multer";
import path from "path";

// Define the base uploads directory
const UPLOADS_DIR = path.join(__dirname, "../../public");
const PROFILE_IMAGES_DIR = path.join(UPLOADS_DIR, "admin-profile");

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Initialize directories
ensureDirectoryExists(UPLOADS_DIR);
ensureDirectoryExists(PROFILE_IMAGES_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PROFILE_IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const adminProfileUpload = multer({
  storage,
});

export default adminProfileUpload;
