import { defineConfig } from "drizzle-kit";
import appConfig from "./server/config/app.config";

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: appConfig.database.url,
  },
});