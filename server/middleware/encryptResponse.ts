import config from "@server/config/app.config";
import crypto from "crypto";

const key = Buffer.from(config.SESSION_KEY!, "base64");

export function encryptResponse(req: any, res: any, next: any) {
  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      key,
      iv
    );

    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(body), "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    // append tag to encrypted data
    const combined = Buffer.concat([encrypted, tag]);

    return originalJson({
      iv: iv.toString("base64"),
      data: combined.toString("base64"),
    });
  };

  next();
}