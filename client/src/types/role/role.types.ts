export type Role = {
    id: string;
    name: string;
    description?: string;
    isSystem?: boolean;
    createdAt?: string;
    tenantId?: string;
};

export type AllRoles = {
    data: Role[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}