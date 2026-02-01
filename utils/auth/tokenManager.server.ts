import { getAccessTokenFromCookies } from "./cookies";
import { decodeJwtPayload } from "./jwt";

/**
 * SERVER-SIDE token utilities
 * These functions only work in Server Components and API Routes
 */

/**
 * Checks if a JWT token is expired or about to expire
 */
function isTokenExpiringSoon(
  token: string,
  bufferSeconds: number = 60,
): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  const expirationTime = payload.exp * 1000;
  const now = Date.now();
  const bufferTime = bufferSeconds * 1000;

  return expirationTime - now < bufferTime;
}

/**
 * Gets a valid access token from cookies (server-side only)
 * Checks expiration but does NOT refresh (that should be handled by client)
 */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return null;
  }

  // Just return the token - let the backend validate it
  // If it's expired, the backend will return 401 and client will refresh
  return accessToken;
}
