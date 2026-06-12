import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "../_shared";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await fetch(backendUrl("/auth/forgot-password"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);
    return NextResponse.json(data ?? { message: "Request failed" }, {
      status: upstream.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { message },
      { status: 500 },
    );
  }
}
