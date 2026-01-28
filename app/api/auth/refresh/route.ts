import { NextRequest, NextResponse } from "next/server";
import { backendUrl, cookieHeader, forwardSetCookie } from "../_shared";
import { setAccessTokenCookie } from "@/utils/auth/cookies";

export async function POST(req: NextRequest) {
  const upstream = await fetch(backendUrl("/auth/refresh-token"), {
    method: "POST",
    headers: {
      cookie: cookieHeader(req),
    },
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json(data ?? { message: "Refresh failed" }, {
      status: upstream.status,
    });
  }

  const accessToken: string | undefined = data?.data?.accessToken;
  if (accessToken) await setAccessTokenCookie(accessToken);

  const res = NextResponse.json(data, { status: upstream.status });
  forwardSetCookie(upstream, res);
  return res;
}
