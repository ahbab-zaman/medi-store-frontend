import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "../_shared";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const upstream = await fetch(backendUrl("/auth/register"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data ?? { message: "Register failed" }, {
    status: upstream.status,
  });
}

