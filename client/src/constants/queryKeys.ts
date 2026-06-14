export const TENANT_SCOPED_QUERY_KEY = "tenant-scoped";
export const ALL_TENANTS_QUERY_KEY = "all-tenants";
export const queryKeys = {
    currentActiveTenant: (tenantId: string) =>
        [TENANT_SCOPED_QUERY_KEY, "current-active-tenant", tenantId] as const,
    userMenu: (tenantId: string, userId: string, roleId: string) =>
        [TENANT_SCOPED_QUERY_KEY, "user-menu", tenantId, userId, roleId] as const,
    allTenants: [ALL_TENANTS_QUERY_KEY] as const,
};
