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
    CURRENT_ACTIVE: `${PREFIX}/tenant/current-active`
  }
} as const;