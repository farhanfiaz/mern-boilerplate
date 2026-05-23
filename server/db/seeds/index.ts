import logger from "@/utils/logger";
import { seedRoles } from "./roles.seed";
import { userSeed } from "./users.seed";

async function seed() {
    try {
        logger.info("🌱 Seeding database...");
        logger.info("🧩 Seeding roles...");
        await seedRoles();
        logger.info("👤 Seeding users...");
        await userSeed();
        logger.info("✅ Database seed completed");
        logger.info("🎉 Seeding completed successfully");
    } catch (err) {
        logger.error("❌ Seed failed:", err);
        throw err;
    }
}

seed().catch(() => {
    process.exit(1);
});