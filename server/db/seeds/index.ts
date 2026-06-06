import logger from "@/utils/logger";
import { seedRoles } from "./roles/roles.seed";
import { superAdminSeed } from "./users/superAdmin.seed";
import { adminSeed } from "./users/admin.seed";
import { userSeed } from "./users/users.seed";
import { seedTenants } from "./tenants/tenants.seed";
import { seedSuperAdminRoles } from "./roles/superAdminRole.seed";
import { seedSubscriptions } from "./tenants/subcription.seed";

async function seed() {
    try {
        logger.info("🌱 Seeding database...");
        await seedSuperAdminRoles();
        await superAdminSeed();

        await seedTenants();
        await seedSubscriptions();
        logger.info("🧩 Seeding roles...");
        await seedRoles();
        logger.info("👤 Seeding default users...");
        await adminSeed();
        await userSeed();
        logger.info("✅ Database seed completed");
        logger.info("🎉 Seeding completed successfully");
        process.exit(0);
    } catch (err) {
        logger.error("❌ Seed failed:", err);
        throw err;
    }
}

seed().catch(() => {
    process.exit(1);
});