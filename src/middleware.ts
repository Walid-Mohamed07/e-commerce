import { NextRequest, NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/checkout", "/profile", "/orders"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect logic
  if (isProtectedRoute && !token) {
    // User trying to access protected route without token
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    // User trying to access auth route with token (already authenticated)
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/orders/:path*",
    // Auth routes
    "/login",
    "/signup",
  ],
};
