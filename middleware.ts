import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export function middleware(req: any) {
  const url = req.nextUrl.clone()

  // Exclude login/signup
  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup") ||
    url.pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  const authHeader = req.headers.get("authorization") || ""
  const token = authHeader.replace("Bearer ", "")

  if (!token) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "sfms_secret")
    return NextResponse.next()
  } catch (err) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }
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