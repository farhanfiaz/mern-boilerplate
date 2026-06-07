export interface Tenant {
    id: string;
    name: string;
    slug: string;
    description?: string;
    website?: string;
    logo?: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
}

export interface PaginatedTenants {
    data: Tenant[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}