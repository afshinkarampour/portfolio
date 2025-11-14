import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Protect /admin routes (redirect if no token)
  if (pathname.startsWith("/admin") && !token) {
    const loginUrl = new URL("/admin-login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
