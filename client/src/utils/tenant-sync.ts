import { AuthResponse } from "@/types/auth.types";
import type { AppEvent } from "@/types/appEvents";

export function buildAuthWithTenant(
    auth: AuthResponse,
    tenantId: string
): AuthResponse {
    return {
        ...auth,
        user: {
            ...auth.user,
            tenantId,
        },
    };
}

export async function persistTenantChange(
    auth: AuthResponse,
    tenantId: string,
    deps: {
        saveStoredAuth: (auth: AuthResponse) => Promise<void>;
        publishEvent: (event: AppEvent) => void;
    }
): Promise<AuthResponse> {
    const updated = buildAuthWithTenant(auth, tenantId);

    await deps.saveStoredAuth(updated);
    deps.publishEvent({ type: "USER_UPDATED", userId: updated.user.userId });
    deps.publishEvent({ type: "COMPANY_CHANGED", companyId: tenantId });

    return updated;
}
