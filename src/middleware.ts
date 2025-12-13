import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  refreshToken,
  getMe,
  type AuthTokens,
  CORE_FRONTEND_URL,
} from "~/lib/core-api";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Handle token from URL (redirect from Core)
  // Expecting ?token=... or ?access_token=... or ?JWT=...
  const urlToken =
    searchParams.get("token") ??
    searchParams.get("access_token") ??
    searchParams.get("JWT");

  if (urlToken) {
    try {
      // Verify the token
      await getMe(urlToken);

      // Create response with redirect to remove query param
      const newUrl = request.nextUrl.clone();
      newUrl.searchParams.delete("token");
      newUrl.searchParams.delete("access_token");
      newUrl.searchParams.delete("JWT");

      const response = NextResponse.redirect(newUrl);

      // Set access token cookie with more robust options
      response.cookies.set("access_token", urlToken, {
        httpOnly: true,
        // Allow cookie to be set on localhost for development, but require secure for production
        secure: process.env.NODE_ENV === "production",
        path: "/",
        // Lax allows the cookie to be sent when navigating from external site (Core)
        sameSite: "lax",
        maxAge: 3600,
      });

      // We probably don't get a refresh token in the URL redirect flow usually,
      // unless provided. If provided in params, we could set it too.
      // For now, assume only access token.

      return response;
    } catch (e) {
      console.error("Token verification error", e);
    }
  }

  // 2. Define Public Routes
  const publicRoutes = [
    "/auth/login", // We might redirect this page to Core in the component, or here
    "/auth/access-denied", // Allow DOCENTE users to see access denied page
    "/privacy-policy",
    "/terms-and-conditions",
    "/api/trpc", // Allow TRPC to handle its own auth or public procedures
    "/api/health", // Health check
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 3. Check Cookies
  const accessToken = request.cookies.get("access_token");
  const refreshTokenCookie = request.cookies.get("refresh_token");

  // If valid access token present, allow
  if (accessToken) {
    // If user is on login page but already logged in, redirect to home
    if (pathname === "/auth/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } else {
    // Check if there is a pending token verification from URL above
    // If urlToken was present and we set the cookie in the response object,
    // request.cookies won't have it yet for this request cycle.
    // However, we returned the response immediately in the block above so we shouldn't reach here?
    // Wait, the block above returns 'response'.
    // If code execution reaches here, it means NO urlToken was found in params.
  }

  // 4. Try Refresh
  if (refreshTokenCookie) {
    try {
      const tokens: AuthTokens = await refreshToken(refreshTokenCookie.value);

      // If we are on a public route (like login), we can still refresh and redirect to home?
      // Or just refresh and stay?
      // If we are on login page, redirect to home after refresh.
      // If we are on protected route, just refresh and continue.

      let response: NextResponse;
      if (pathname === "/auth/login") {
        response = NextResponse.redirect(new URL("/", request.url));
      } else {
        response = NextResponse.next();
      }

      // Update cookies
      response.cookies.set("access_token", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: tokens.expires_in,
      });

      if (tokens.refresh_token) {
        response.cookies.set("refresh_token", tokens.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60,
        });
      }

      return response;
    } catch (error) {
      console.error("Token refresh failed", error);
      // Refresh failed, delete cookies and fall through to redirect
      // We can't delete cookies on the request object, so we'll handle redirect below
      // and let the response clear them.
    }
  }

  // 5. Allow Public Routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 6. Redirect to Core Login
  const coreLoginUrl = new URL(CORE_FRONTEND_URL);
  // Pass the current URL as a place to return to?
  // Core might support ?redirect=...
  // coreLoginUrl.searchParams.set("redirect", request.url);

  const response = NextResponse.redirect(coreLoginUrl.toString());

  // Clear any invalid cookies
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
