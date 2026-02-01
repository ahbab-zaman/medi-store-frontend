import { NextResponse } from "next/server";
import { backendUrl } from "../_shared";
import { getValidAccessToken } from "@/utils/auth/tokenManager.server";

export async function GET() {
  const accessToken = await getValidAccessToken();

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
