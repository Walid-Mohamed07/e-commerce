import { NextRequest, NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/checkout", "/profile", "/orders"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export const proxy = async (request: NextRequest) => {
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

  const response = NextResponse.next();

  // Assign a persistent visitorId cookie to unauthenticated users so their
  // guest cart can be identified and later merged on login.
  if (!token && !request.cookies.get("visitorId")?.value) {
    const visitorId = crypto.randomUUID();
    response.cookies.set("visitorId", visitorId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
      httpOnly: false, // readable by client JS to cross-reference localStorage
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
};

export const config = {
  matcher: [
    // Exclude Next.js internals and static assets; run on all other routes
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)).*)",
  ],
};
