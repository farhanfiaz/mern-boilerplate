import { ENDPOINTS } from "@/api/endpoints";
import { getSessionKey } from "@/crypto/session";
import { encrypt, decrypt } from "@/crypto/aes";
import { AuthResponse } from "@/types/auth.types";
import logger from "./logger";

const STORAGE_KEY = ENDPOINTS.LOCALSTORAGE.USER;
const SELECTED_ROLE_KEY = ENDPOINTS.LOCALSTORAGE.SELECTED_ROLE;

export async function getStoredAuth(): Promise<AuthResponse | null> {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    try {
        return await decrypt(
            getSessionKey(),
            JSON.parse(raw)
        );
    } catch (err) {
        logger.error("Failed to decrypt auth data", err);

        localStorage.removeItem(STORAGE_KEY);

        return null;
    }
}

export async function saveStoredAuth(
    auth: AuthResponse
): Promise<void> {
    const encrypted = await encrypt(
        getSessionKey(),
        auth
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(encrypted)
    );
}

export function clearStoredAuth(): void {
    localStorage.removeItem(STORAGE_KEY);
    clearSelectedRole();
}

export function getSelectedRole(): string | null {
    return localStorage.getItem(SELECTED_ROLE_KEY);
}

export function clearSelectedRole() {
    localStorage.removeItem(SELECTED_ROLE_KEY);
}

export function setSelectedRole(role: string) {
    localStorage.setItem(SELECTED_ROLE_KEY, role);
}
