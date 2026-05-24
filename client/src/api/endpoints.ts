export const ENDPOINTS = {
    SYSTEM: {
        BACKEND: "api",
        HEALTH: "api/health",
        LOCALSTORAGEKEY: "user"
    },
    AUTH: {
        LOGIN: "api/auth/login",
        REGISTER: "api/auth/register",
        PROFILE: "api/auth/profile",
        REFRESH: "api/auth/refresh-token",
    }
} as const;