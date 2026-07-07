import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

const publicRoutes = ["/", "/login", "/register", "/forgot-password"]
const authRoutes = ["/login", "/register"]
const apiAuthPrefix = "/api/auth"
const apiPrefix = "/api"

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow API auth routes
  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next()
  }

  // Allow public API routes
  if (pathname.startsWith(apiPrefix)) {
    return NextResponse.next()
  }

  // Skip middleware for static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/icons") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const session = await auth()

  // Redirect authenticated users away from auth pages
  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users to login
  if (!session && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
