export type menu = {
    id: string;
    name: string;
    parentId: string | null;
    groupLabel: string | null;
    icon: string | null;
    url: string | null;
    sortOrder: number;
    isActive: boolean;
    isAction: boolean;
}

export type getMenusDto = {
    menus: menu[];
}