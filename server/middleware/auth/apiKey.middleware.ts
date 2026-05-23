import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "@server/utils/httpStatusCode";
import appConfig from "@server/config/app.config";

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return sendResponse(res, HttpStatusCode.FORBIDDEN, false, "Unauthorized: API key is missing..!");
  }

  if (apiKey !== appConfig.apiKeys) {
    return sendResponse(res, HttpStatusCode.FORBIDDEN, false, "Forbidden: Invalid API key..!");
  }

  next();
};