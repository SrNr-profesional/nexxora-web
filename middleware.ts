import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/adminAuth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicAdminPath = pathname === "/admin/login" || pathname === "/api/admin/login";
  const isProtectedPage = pathname.startsWith("/admin") && !isPublicAdminPath;
  const isProtectedApi = pathname.startsWith("/api/admin") && !isPublicAdminPath;

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    if (isProtectedApi) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
