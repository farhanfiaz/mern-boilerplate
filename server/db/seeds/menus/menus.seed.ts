import logger from "@server/utils/logger";
import { db } from "@server/db/connection";
import { defaultMenus } from "@server/enums/defaultMenus";
import { menus } from "@server/db/schema";

export async function seedMenus() {
    logger.info(`👤 Menu Seeding Starting`);

    defaultMenus.forEach(async (menu) => {
        logger.info(`Seeding menu: ${menu.name}`);

        const isMenuExist = await db.query.menus.findFirst({
            where: (menus, { eq }) => (eq(menus.name, menu.name)),
        });
        if (isMenuExist) {
            logger.info(`Menu already exists: ${menu.name}`);
            return;
        }

        await db.insert(menus).values({
            name: menu.name,
            parentId: menu.parentId,
            groupLabel: menu.groupLabel,
            icon: menu.icon,
            url: menu.url,
            sortOrder: menu.sortOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: menu.isActive,
            isAction: menu.isAction,
        });

    });
    logger.info(`👤 Menu Seeding Ending`);
}
