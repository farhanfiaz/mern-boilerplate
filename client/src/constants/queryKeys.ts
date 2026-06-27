export const TENANT_SCOPED_QUERY_KEY = "tenant-scoped";
export const ALL_TENANTS_QUERY_KEY = "all-tenants";
export const queryKeys = {
    currentActiveTenant: (tenantId: string) =>
        [TENANT_SCOPED_QUERY_KEY, "current-active-tenant", tenantId] as const,
    userMenu: (tenantId: string, userId: string, roleId: string) =>
        [TENANT_SCOPED_QUERY_KEY, "user-menu", tenantId, userId, roleId] as const,
    allTenants: (page: number, pageSize: number, search: string) =>
        [ALL_TENANTS_QUERY_KEY, { page, pageSize, search }] as const,
    assignMenuByRoleById: (roleId: string) => ["assign-menu-by-role-id", roleId] as const,
    assignMenuByUserId: (userId: string) => ["assign-menu-by-user-id", userId] as const,
};
