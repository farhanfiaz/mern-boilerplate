import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import logger from "@server/utils/logger";
import appConfig from "../config/app.config";

const pool = new Pool({
  connectionString: appConfig.database.url,
});

export const testConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT 1 as connected');
    if (result.rows && result.rows.length > 0) {
      logger.info('✅ Database connection successful');
      return true;
    }
    logger.warn('⚠️ Database connection test returned no results');
    return false;
  } catch (error) {
    logger.error('❌ Database connection failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
};

testConnection().then((result) => {
  if (!result) {
    logger.error('❌ Database connection failed');
    process.exit(1);
  }
});

export const db = drizzle({ client: pool, schema });