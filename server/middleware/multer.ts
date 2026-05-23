import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ✅ Allowed extensions (BEST PRACTICE = extension + MIME)
const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",

  ".pdf",

  ".csv",

  ".xls",
  ".xlsx",

  ".doc",
  ".docx",

  ".txt",
]);

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",

  "application/pdf",

  "text/csv",
  "text/plain",

  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const mimeOk = allowedMimeTypes.has(file.mimetype);
  const extOk = allowedExtensions.has(ext);

  if (!mimeOk || !extOk) {
    return cb(new Error("Invalid file type"));
  }

  cb(null, true);
};

// Shared upload instance
export const upload = multer({
  storage,
  fileFilter,

  // GLOBAL per-file limits
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB per file
  },
});