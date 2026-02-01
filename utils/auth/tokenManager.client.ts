import { decodeJwtPayload } from "./jwt";

/**
 * CLIENT-SIDE token utilities
 * These functions work in the browser (client components)
 */

/**
 * Checks if a JWT token is expired or about to expire
 * @param token - JWT access token
 * @param bufferSeconds - Refresh if token expires within this many seconds (default: 60)
 * @returns true if token needs refresh
 */
export function isTokenExpiringSoon(
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
 * Attempts to refresh the access token using the refresh token cookie
 * This calls your Next.js API route which handles server-side cookie reading
 * @returns The new access token if successful, null otherwise
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include", // Important: send cookies
    });

    if (!response.ok) {
      console.error("Token refresh failed:", response.status);
      return null;
    }

    const data = await response.json();
    const accessToken = data?.data?.accessToken;

    return accessToken || null;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

/**
 * Fetches the current user's access token from the server
 * This is used on initial page load to sync the token to the client
 */
export async function fetchAccessTokenFromServer(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/token", {
      credentials: "include",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.accessToken || null;
  } catch (error) {
    console.error("Failed to fetch access token:", error);
    return null;
  }
}
