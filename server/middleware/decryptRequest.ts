import logger from "@/utils/logger";
import config from "@server/config/app.config";
import { sendResponse } from "@server/utils/apiResponse";
import { HttpStatusCode } from "axios";
import crypto from "crypto";

const key = Buffer.from(config.SESSION_KEY!, "base64");

export function decryptRequest(req: any, res: any, next: any) {
  try {
    if (req.method === "GET" || !req.body || !req.body.iv || !req.body.data) {
      return next();
    }
    const { iv, data } = req.body;

    const raw = Buffer.from(data, "base64");

    const tag = raw.subarray(raw.length - 16);
    const ciphertext = raw.subarray(0, raw.length - 16);

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(iv, "base64")
    );

    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    req.body = JSON.parse(decrypted.toString());
    next();
  } catch (err) {
    sendResponse(res, HttpStatusCode.BadRequest, false, "Invalid encrypted payload");
  }
}