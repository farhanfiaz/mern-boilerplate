import { isDemoMode } from "@/utils/isDemoMode";

let sessionKey: CryptoKey | null = null;

export async function initSessionKey() {
  const base64Key = import.meta.env.VITE_SESSION_KEY;

  const raw = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
  if (isDemoMode()) {
    console.warn("Skipping crypto for demo");
    return;
  }
  sessionKey = await crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

export function getSessionKey(): CryptoKey {
  if (!sessionKey) {
    throw new Error("Session key not initialized. Call initSessionKey() first.");
  }

  return sessionKey;
}