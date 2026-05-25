export function generateKey() {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encrypt(key: CryptoKey, data: any) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    iv: arrayToBase64(iv),
    data: arrayBufferToBase64(ciphertext),
  };
}

export async function decrypt(
  key: CryptoKey,
  payload: { iv: string; data: string }
) {
  const iv = base64ToArray(payload.iv);
  const data = base64ToArray(payload.data);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return JSON.parse(new TextDecoder().decode(decrypted));
}

// helpers
function arrayToBase64(buf: Uint8Array | ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToArray(b64: string) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

function arrayBufferToBase64(buf: ArrayBuffer) {
  return arrayToBase64(new Uint8Array(buf));
}