import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/app/api/auth/_shared";
import { getAccessTokenFromCookies } from "@/utils/auth/cookies";

export async function GET(req: NextRequest) {
  try {
    const accessToken = await getAccessTokenFromCookies();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const upstream = await fetch(backendUrl("/cart"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);

    return NextResponse.json(data ?? { message: "Failed to fetch cart" }, {
      status: upstream.status,
    });
  } catch (error: any) {
    console.error("Get cart route error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
