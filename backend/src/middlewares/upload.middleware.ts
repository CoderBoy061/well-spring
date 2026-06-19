import multer from "multer";
import fs from "fs";
import path from "path";

const isDevelopment = process.env.NODE_ENV === "development";
const uploadDir = path.resolve("uploads");

if (isDevelopment && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^\w.\-]/g, "-");
}

const localStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const creatorDir = path.join(uploadDir, req.creatorId as string);

    if (!fs.existsSync(creatorDir)) {
      fs.mkdirSync(creatorDir, { recursive: true });
    }

    cb(null, creatorDir);
  },

  filename: (_req, file, cb) => {
    const sanitizedName = sanitizeFilename(file.originalname);
    cb(null, `${Date.now()}-${sanitizedName}`);
  },
});

const s3UploadStorage = multer.memoryStorage();

export const upload = multer({
  storage: isDevelopment ? localStorage : s3UploadStorage,
  limits: {
    // fileSize: 200 * 1024 * 1024,
  },
});

export const uploadMode = isDevelopment ? "local" : "s3";
