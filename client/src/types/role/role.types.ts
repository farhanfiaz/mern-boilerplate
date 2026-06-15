export type Role = {
    id: string;
    name: string;
    description?: string;
    isSystem?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
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

// Create payload (id not allowed)
export type CreateRolePayload = Omit<Role, "id">;

// Update payload (id required)
export type UpdateRolePayload = Pick<Role, "id"> &
    Partial<Omit<Role, "id">>;