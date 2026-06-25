import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || "development";

const config = {
  isDemoMode: process.env.VITE_DEMO_MODE === "true",
  environment: env,
  isDevelopment: env == "development",
  isProduction: env == "production",
  port: parseInt(process.env.VITE_PORT || "5000"),
  host: process.env.HOST || "0.0.0.0",

  database: {
    url: process.env.DATABASE_URL!,
  },
  apiKeys: process.env.VITE_API_KEYS,
  security: {
    jwtSecret: process.env.VITE_JWT_SECRET!,
    refreshSecret: process.env.VITE_REFRESH_SECRET!,
    jwtExpiresIn: process.env.VITE_JWT_EXPIRES_IN!,
    refreshExpiresIn: process.env.VITE_REFRESH_EXPIRES_IN!,
  },
  frontend: {
    urls: process.env.VITE_FRONTEND_URL?.split(',')
      .map(url => url.trim()),
  },
  SESSION_KEY: process.env.VITE_SESSION_KEY!
};

export default config;