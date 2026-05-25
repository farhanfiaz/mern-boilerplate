export const PREFIX = "api";

export const ENDPOINTS = {
  PREFIX,
  SYSTEM: {
    BACKEND: `${PREFIX}`,
    HEALTH: `${PREFIX}/health`,
    LOCALSTORAGEKEY: "user",
  },
  AUTH: {
    LOGIN: `${PREFIX}/auth/login`,
    REGISTER: `${PREFIX}/auth/register`,
    PROFILE: `${PREFIX}/auth/profile`,
    REFRESH: `${PREFIX}/auth/refresh-token`,
  },
} as const;