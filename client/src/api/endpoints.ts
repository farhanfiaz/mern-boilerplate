export const PREFIX = "api";

export const ENDPOINTS = {
  PREFIX,
  LOCALSTORAGE: {
    USER: "user",
    SELECTED_ROLE: "selectedRole",
  },
  SYSTEM: {
    BACKEND: `${PREFIX}`,
    HEALTH: `${PREFIX}/health`,
  },
  AUTH: {
    LOGIN: `${PREFIX}/auth/login`,
    REGISTER: `${PREFIX}/auth/register`,
    PROFILE: `${PREFIX}/auth/profile`,
    REFRESH: `${PREFIX}/auth/refresh-token`,
  },
  SIDEBAR: {
    GET_USER_MENUS: `${PREFIX}/menus/get-user-menus`
  },
  TENANTS: {
    CURRENT_ACTIVE: `${PREFIX}/tenant/current-active`,
    GET_ALL_TENANTS: `${PREFIX}/tenant/get-all-tenants`,
    CREATE_TENANT: `${PREFIX}/tenant/create-tenant`,
    EDIT_TENANT: `${PREFIX}/tenant/edit-tenant`,
    DELETE_TENANT: `${PREFIX}/tenant/delete-tenant`,
    IN_ACTIVE_TENANT: `${PREFIX}/tenant/in-active-tenant`,
    CURRENT_ACTIVE_WITH_PAGINATION: `${PREFIX}/tenant/current-active-with-pagination`
  },
  ROLE: {
    GET_ALL_ROLES: `${PREFIX}/role/get-all-roles`,
    GET_ROLE_BY_ID: `${PREFIX}/role/get-role-by-id`,
    CREATE_ROLE: `${PREFIX}/role/create-role`,
    UPDATE_ROLE: `${PREFIX}/role/update-role`,
    DELETE_ROLE: `${PREFIX}/role/delete-role`,
    IN_ACTIVE_ROLE: `${PREFIX}/role/in-active-role`,
    ALL_TENANT_ROLES: `${PREFIX}/role/all-tenant-roles`
  },
  USER_MANAGEMENT: {
    GET_ALL_USERS: `${PREFIX}/user/get-all-users`,
    GET_USER_BY_ID: `${PREFIX}/user/get-user-by-id`,
    CREATE_USER: `${PREFIX}/user/create-user`,
    UPDATE_USER: `${PREFIX}/user/update-user`,
    DELETE_USER: `${PREFIX}/user/delete-user`,
    IN_ACTIVE_USER: `${PREFIX}/user/in-active-user`,
  },
  ROLE_ACCESS: {
    SAVE_ROLE_ACCESS: `${PREFIX}/role-access/save-role-access`,
    GET_ALL_MENU_BY_ROLE_ID: `${PREFIX}/role-access/get-all-menu-by-role-id`,
  },
} as const;