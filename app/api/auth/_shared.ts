import { NextRequest, NextResponse } from "next/server";
import { assertServerEnv, env } from "@/utils/env";

export function backendUrl(pathname: string) {
  assertServerEnv();
  const url = `${env.backendApiBaseUrl}${pathname}`;
  return url;
}

export function forwardSetCookie(from: Response, to: NextResponse) {
  // Next's fetch Response supports getSetCookie() in modern runtimes.
  const anyHeaders = from.headers as any;
  const setCookies: string[] | undefined =
    typeof anyHeaders.getSetCookie === "function"
      ? anyHeaders.getSetCookie()
      : undefined;

  if (setCookies?.length) {
    for (const c of setCookies) to.headers.append("set-cookie", c);
    return;
  }

  const single = from.headers.get("set-cookie");
  if (single) to.headers.append("set-cookie", single);
}

export function cookieHeader(req: NextRequest) {
  return req.headers.get("cookie") ?? "";
}
