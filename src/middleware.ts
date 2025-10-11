import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export { default } from "next-auth/middleware";
export { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  const isAuthPage =
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify");

  const isDashboard = url.pathname.startsWith("/dashboard");

  if (token && isAuthPage) {
    // already signed in → go to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && isDashboard) {
    // not signed in → go to sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // allow normal navigation
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
