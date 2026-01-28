import { NextRequest, NextResponse } from "next/server";
import { backendUrl, forwardSetCookie } from "../_shared";
import { setAccessTokenCookie } from "@/utils/auth/cookies";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const upstream = await fetch(backendUrl("/auth/login"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    // allow backend to set refresh cookie, which we'll forward
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json(data ?? { message: "Login failed" }, {
      status: upstream.status,
    });
  }

  const accessToken: string | undefined = data?.data?.accessToken;
  if (accessToken) await setAccessTokenCookie(accessToken);

  const res = NextResponse.json(data, { status: upstream.status });
  forwardSetCookie(upstream, res);
  return res;
}
