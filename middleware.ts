import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/editor"]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"]

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")
  const path = request.nextUrl.pathname

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => path === route)

  // If it's a protected route and there's no session, redirect to login
  if (isProtectedRoute && !sessionCookie) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", path)
    return NextResponse.redirect(url)
  }

  // If it's an auth route and there's a session, redirect to dashboard
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/login", "/signup"],
}
