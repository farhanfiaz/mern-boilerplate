import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import logger from "@server/utils/logger";
import multer from "multer";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("🔥 Error:", err);

  if (err instanceof multer.MulterError) {
    return sendResponse(res, HttpStatusCode.BAD_REQUEST, false, err.message || "Internal Server Error");
  }

  const statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;

  return sendResponse(res, statusCode, false, err.message || "Internal Server Error");
};