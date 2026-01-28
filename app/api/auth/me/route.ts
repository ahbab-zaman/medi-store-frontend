import { NextResponse } from "next/server";
import { backendUrl } from "../_shared";
import { getAccessTokenFromCookies } from "@/utils/auth/cookies";

export async function GET() {
  const accessToken = await getAccessTokenFromCookies();
  if (!accessToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const upstream = await fetch(backendUrl("/auth/me"), {
    method: "GET",
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data ?? { message: "Failed to load profile" }, {
    status: upstream.status,
  });
}
