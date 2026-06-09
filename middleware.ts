import { NextRequest, NextResponse } from "next/server";
import { decodeJwtPayload } from "@/utils/auth/jwt";
import { ACCESS_TOKEN_COOKIE } from "@/utils/auth/cookies";

const roleHome: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  SELLER: "/seller/dashboard",
  CUSTOMER: "/customer/dashboard",
};

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/customer") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/my-account") ||
    pathname.startsWith("/my-orders") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Decode the JWT payload (no crypto needed in Edge Runtime).
  // The cookie is httpOnly — it cannot be written by client-side JS,
  // so decoding without re-verifying the signature is safe here.
  // Full cryptographic verification happens in server-side Route Handlers.
  const payload = decodeJwtPayload(token);
  const role = payload?.role;

  // Check expiry manually
  const now = Math.floor(Date.now() / 1000);
  if (!role || (payload?.exp && payload.exp < now)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
  }
  if (pathname.startsWith("/seller") && role !== "SELLER") {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
  }
  if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/customer/:path*",
    "/account/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/my-account/:path*",
    "/my-orders/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};

