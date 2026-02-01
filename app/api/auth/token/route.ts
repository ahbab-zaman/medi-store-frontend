import { NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "@/utils/auth/cookies";

/**
 * GET /api/auth/token
 * Returns the current access token from httpOnly cookie
 * Used by client to sync token to Zustand store on app load
 */
export async function GET() {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return NextResponse.json({ message: "No access token" }, { status: 401 });
  }

  return NextResponse.json({ accessToken });
}
