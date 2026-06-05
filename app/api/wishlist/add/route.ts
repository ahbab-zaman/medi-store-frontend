import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/app/api/auth/_shared";
import { getAccessTokenFromCookies } from "@/utils/auth/cookies";

export async function POST(req: NextRequest) {
  try {
    const accessToken = await getAccessTokenFromCookies();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));

    const upstream = await fetch(backendUrl("/wishlist/add"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);

    return NextResponse.json(
      data ?? { message: "Failed to add to wishlist" },
      {
        status: upstream.status,
      },
    );
  } catch (error: any) {
    console.error("Add to wishlist route error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
