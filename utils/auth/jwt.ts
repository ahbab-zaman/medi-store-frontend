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

