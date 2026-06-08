import { NextRequest, NextResponse } from "next/server";
import { verifyJwtPayload } from "@/utils/auth/jwt";
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
    pathname.startsWith("/profile") // Adding profile just in case, though it likely maps to my-account
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

  // Cryptographically verify the JWT signature — prevents forged tokens
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET ?? process.env.JWT_SECRET ?? "";
  const payload = await verifyJwtPayload(token, secret);
  const role = payload?.role;

  // If token is invalid/expired/forged, treat as logged out.
  if (!role) {
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
    "/profile/:path*",
  ],
};
