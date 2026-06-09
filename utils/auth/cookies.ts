import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "ms_access_token";

export async function setAccessTokenCookie(accessToken: string) {
  const jar = await cookies();
  jar.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 15, // 15 days — matches JWT_EXPIRES_IN on the backend
  });
}

export async function clearAccessTokenCookie() {
  const jar = await cookies();
  jar.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAccessTokenFromCookies() {
  const jar = await cookies();
  return jar.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}
