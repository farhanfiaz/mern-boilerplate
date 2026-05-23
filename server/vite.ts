import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger, ResolvedServerOptions } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import logger from "./utils/logger";

const viteLogger = createLogger();

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
      },
    },
    server: serverOptions as ResolvedServerOptions,
    appType: "custom",
  });

  // Serve WebViewer files from node_modules
  const webviewerPath = path.resolve(import.meta.dirname, "..", "node_modules", "@pdftron", "webviewer", "public");
  if (fs.existsSync(webviewerPath)) {
    app.use("/webviewer/lib", express.static(webviewerPath, {
      setHeaders: (res, filePath) => {
        // Set proper MIME type for .mem files
        if (filePath.endsWith('.mem')) {
          res.setHeader('Content-Type', 'application/octet-stream');
        }
      }
    }));
  }

  app.use(vite.middlewares);
  app.use(async (req, res, next) => {
    if (req.method !== "GET" || req.originalUrl.startsWith("/api")) {
      return next();
    }

    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // distPath should be dist/public (from root, server is in dist/server)
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    logger.error(`Could not find the build directory: ${distPath}, make sure to build the client first`);
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve WebViewer files - check multiple possible locations
  const webviewerPaths = [
    path.resolve(import.meta.dirname,  "webviewer", "lib"), // webviewer/lib (from root)
    path.resolve(import.meta.dirname, "public", "webviewer", "lib"), // public/webviewer/lib (from root)
  ];

  for (const webviewerPath of webviewerPaths) {
    if (fs.existsSync(webviewerPath)) {
      app.use("/webviewer/lib", express.static(webviewerPath, {
        setHeaders: (res, filePath) => {
          // Set proper MIME type for .mem files
          if (filePath.endsWith('.mem')) {
            res.setHeader('Content-Type', 'application/octet-stream');
          }
        }
      }));
      break; // Use first found location
    }
  }

  app.use(express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    index:false,
    setHeaders: (res, filePath) => {
      // Set proper MIME type for .mem files
      if (filePath.endsWith('.mem')) {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
    }
  }));

  // fall through to index.html if the file doesn't exist (but not for webviewer paths)
  app.use((req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    // Don't serve index.html for webviewer paths - let them 404 if not found
    if (req.originalUrl.startsWith("/webviewer/")) {
      return next();
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
