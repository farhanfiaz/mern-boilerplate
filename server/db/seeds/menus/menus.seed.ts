import logger from "@server/utils/logger";
import { db } from "@server/db/connection";
import { defaultMenus } from "@server/enums/defaultMenus";
import { menus } from "@server/db/schema";

export async function seedMenus() {
    logger.info(`👤 Menu Seeding Starting`);

    const parentMenus = defaultMenus.filter(menu => !menu.parentId);
    const childMenus = defaultMenus.filter(menu => menu.parentId);

    for (const parentMenu of parentMenus) {
        logger.info(`Seeding parent menu: ${parentMenu.name}`);
        const isMenuExist = await db.query.menus.findFirst({
            where: (menus, { eq }) => (eq(menus.name, parentMenu.name)),
        });
        if (isMenuExist) {
            logger.info(`Menu already exists: ${parentMenu.name}`);
            return;
        }
        await db.insert(menus).values({
            name: parentMenu.name,
            parentId: parentMenu.parentId,
            groupLabel: parentMenu.groupLabel,
            icon: parentMenu.icon,
            url: parentMenu.url,
            sortOrder: parentMenu.sortOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: parentMenu.isActive,
            isAction: parentMenu.isAction,
        });
        logger.info(`Parent menu seeded: ${parentMenu.name}`);
    }
    for (const childMenu of childMenus) {
        logger.info(`Seeding child menu: ${childMenu.name}`);
        const isMenuExist = await db.query.menus.findFirst({
            where: (menus, { eq }) => (eq(menus.name, childMenu.name)),
        });
        if (isMenuExist) {
            logger.info(`Menu already exists: ${childMenu.name}`);
            return;
        }
        const parentMenu = await db.query.menus.findFirst({
            where: (menus, { eq }) => (eq(menus.name, childMenu.parentId)),
        });
        if (!parentMenu) {
            logger.info(`Parent menu not found: ${childMenu.parentId}`);
            return;
        }
        await db.insert(menus).values({
            name: childMenu.name,
            parentId: parentMenu.id,
            groupLabel: childMenu.groupLabel,
            icon: childMenu.icon,
            url: childMenu.url,
            sortOrder: childMenu.sortOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: childMenu.isActive,
            isAction: childMenu.isAction,
        });
        logger.info(`Child menu seeded: ${childMenu.name}`);
    }
    logger.info(`👤 Menu Seeding Ending`);
}
