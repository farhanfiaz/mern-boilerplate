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
  }
} as const;