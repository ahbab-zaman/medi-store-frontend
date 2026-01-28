import { NextRequest, NextResponse } from "next/server";
import { backendUrl, cookieHeader, forwardSetCookie } from "../_shared";
import {
  clearAccessTokenCookie,
  getAccessTokenFromCookies,
} from "@/utils/auth/cookies";

export async function POST(req: NextRequest) {
  const accessToken = await getAccessTokenFromCookies();

  const upstream = await fetch(backendUrl("/auth/logout"), {
    method: "POST",
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : "",
      cookie: cookieHeader(req),
    },
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => null);
  await clearAccessTokenCookie();

  const res = NextResponse.json(data ?? { message: "Logged out" }, {
    status: upstream.status,
  });
  forwardSetCookie(upstream, res);
  return res;
}
