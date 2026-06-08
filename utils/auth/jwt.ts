export type JwtPayload = {
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

function base64UrlToString(input: string) {
  // base64url -> base64
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);

  // Works in both Edge (atob) and Node (Buffer)
  if (typeof globalThis.atob === "function") {
    // atob returns binary string; convert to UTF-8
    const binary = globalThis.atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  // Node fallback
  // eslint-disable-next-line no-restricted-globals
  return Buffer.from(base64, "base64").toString("utf8");
}

function base64UrlToBytes(input: string): Uint8Array {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) base64 += "=".repeat(4 - pad);
  const binary = globalThis.atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** Decode without verification — only use for non-security-critical reads. */
export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const json = base64UrlToString(parts[1]!);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Cryptographically verify a JWT using HMAC-SHA256 via the Web Crypto API
 * (available in Next.js Edge runtime). Returns the decoded payload on success,
 * or null if the signature is invalid or the token is expired.
 */
export async function verifyJwtPayload(
  token: string,
  secret: string,
): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const [headerB64, payloadB64, signatureB64] = parts as [
      string,
      string,
      string,
    ];

    // Import the secret key for HMAC-SHA256
    const key = await globalThis.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    // Verify signature over "header.payload"
    const signingInput = new TextEncoder().encode(
      `${headerB64}.${payloadB64}`,
    );
    const signature = base64UrlToBytes(signatureB64);

    const valid = await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      signature as any,
      signingInput,
    );

    if (!valid) return null;

    // Decode and check expiry
    const payload = JSON.parse(
      base64UrlToString(payloadB64),
    ) as JwtPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000))
      return null;

    return payload;
  } catch {
    return null;
  }
}
