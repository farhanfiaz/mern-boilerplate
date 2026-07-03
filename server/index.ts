import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { createServer } from "http";

import { serveStatic, setupVite } from "./vite";
import router from "./modules/routers";
import { authMiddleware } from "./middleware";
import { securityHeaders } from "./middleware/header.middleware";

import appConfig from "./config/app.config";
import logger from "./utils/logger";

const app = express();

// Trust proxy for rate limiting and security
app.set("trust proxy", 1);

// ---------------- SECURITY ----------------
app.use(
  helmet({
    contentSecurityPolicy:
      (appConfig.isDemoMode == true)
        ? false
        : {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'", "wss:", "ws:"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "data:"],
            frameSrc: ["'none'"],
          },
        },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

app.use(securityHeaders);

// ---------------- CORS ----------------
app.use(cors(authMiddleware.corsOptions));

// ---------------- BODY PARSER ----------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

// ---------------- STATIC FILES ----------------
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// 👉 ADD THIS BEFORE /api middleware
app.get("/api/users/:id/photo", async (req, res) => {
  const fs = await import("fs");
  const path = await import("path");

  const userId = req.params.id;

  const photoPath = path.join(
    process.cwd(),
    "uploads/users",
    `${userId}.png`
  );

  const defaultImage = path.join(
    process.cwd(),
    "uploads/default-image.png"
  );

  const finalPath = fs.existsSync(photoPath)
    ? photoPath
    : defaultImage;

  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

  return res.sendFile(finalPath);
});

// ---------------- ROUTES ----------------
app.get(
  "/api/health",
  authMiddleware.apiLimiter,
  (req: Request, res: Response) => {
    res.json({ message: "Hello from backend API" });
  }
);
app.get(
  "/index.js",
  authMiddleware.apiLimiter,
  (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.redirect(baseUrl);
  }
);

app.use(
  "/api",
  authMiddleware.decryptRequest,
  authMiddleware.apiLimiter,
  authMiddleware.encryptResponse,
  authMiddleware.apiKeyMiddleware,
  router
);

//app.use(authMiddleware.encryptResponse);
// ---------------- ERROR HANDLER ----------------
app.use(authMiddleware.errorMiddleware);

// ---------------- SERVER ----------------
(async () => {
  const isDev = appConfig.isDevelopment;

  const httpServer = createServer(app);

  if (isDev) {
    logger.info("Running in development mode with Vite");
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const port = appConfig.port;

  httpServer.listen(port, appConfig.host, () => {
    logger.info(`Serving on port ${port}`);
  });
})();