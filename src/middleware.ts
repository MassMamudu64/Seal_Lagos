import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionSecret,
  verifyAdminSessionToken,
} from "@/lib/admin/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAuthenticated = await verifyAdminSessionToken(
    req.cookies.get(ADMIN_SESSION_COOKIE)?.value,
    getAdminSessionSecret(),
  );

  if (!isAuthenticated && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
