import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/app/api/auth/_shared";
import { getAccessTokenFromCookies } from "@/utils/auth/cookies";

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ medicineId: string }> },
) {
  try {
    const accessToken = await getAccessTokenFromCookies();
    const params = await props.params;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { medicineId } = params;

    const upstream = await fetch(backendUrl(`/wishlist/remove/${medicineId}`), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);

    return NextResponse.json(
      data ?? { message: "Failed to remove from wishlist" },
      {
        status: upstream.status,
      },
    );
  } catch (error: any) {
    console.error("Remove from wishlist route error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
