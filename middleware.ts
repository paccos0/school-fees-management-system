import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl

  // allow auth routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  // read session cookie
  const session = req.cookies.get("sfms_session")

  if (!session) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/student/:path*",
    "/parent/:path*",
    "/students/:path*",
    "/payments/:path*",
    "/fees/:path*",
    "/penalties/:path*",
  ],
}