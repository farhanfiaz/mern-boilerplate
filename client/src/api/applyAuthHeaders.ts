import { InternalAxiosRequestConfig } from "axios";
import { AuthResponse } from "@/types/auth.types";
import { getSelectedRole } from "@/utils/auth-storage";

export function applyAuthHeaders(
    config: InternalAxiosRequestConfig,
    userObj: AuthResponse | null,
    apiKey?: string
): InternalAxiosRequestConfig {
    if (userObj?.token) {
        config.headers.Authorization = `Bearer ${userObj.token}`;
    }

    if (apiKey) {
        config.headers["x-api-key"] = apiKey;
    }

    if (userObj?.user?.tenantId) {
        config.headers["tenant-id"] = userObj.user.tenantId;
    }

    if (userObj?.user?.userId) {
        config.headers["user-id"] = userObj.user.userId;
    }

    if (getSelectedRole()) {
        config.headers["role"] = getSelectedRole() as string;
    }

    return config;
}
