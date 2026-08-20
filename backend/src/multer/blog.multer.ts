import fs from "fs";
import multer from "multer";
import path from "path";

// Define the base uploads directory
const UPLOADS_DIR = path.join(__dirname, "../../public");
const BLOG_IMAGES_DIR = path.join(UPLOADS_DIR, "blogs");

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Initialize directories
ensureDirectoryExists(UPLOADS_DIR);
ensureDirectoryExists(BLOG_IMAGES_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, BLOG_IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const BlogImageUpload = multer({
  storage,
});

export default BlogImageUpload;
