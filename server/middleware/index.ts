import { apiKeyMiddleware } from "./auth/apiKey.middleware";
import { authenticateToken } from "./auth/authenticateToken.middleware";
import { errorMiddleware } from "./error.middleware";
import { checkTotalSize } from "./checkTotalSize.middleware";
import { upload } from "./multer";
import { securityHeaders } from "./header.middleware";
import { apiLimiter, authLimiter, passwordResetLimiter } from "./rateLimit.middleware";
import { corsOptions } from "./cors-options.middleware";
import { decryptRequest } from "./decryptRequest";
import { encryptResponse } from "./encryptResponse";


export const authMiddleware = {
  apiKeyMiddleware,
  errorMiddleware,
  authenticateToken,
  checkTotalSize,
  uploadSingleFile: upload.single("file"),
  uploadMultiFiles: upload.array("file", 5),
  securityHeaders,
  authLimiter,
  passwordResetLimiter,
  apiLimiter,
  corsOptions,
  decryptRequest,
  encryptResponse
};