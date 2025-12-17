import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  refreshToken,
  getMe,
  type AuthTokens,
  CORE_FRONTEND_URL,
} from "~/lib/core-api";

// Helper to set auth cookies on response
function setAuthCookies(
  response: NextResponse,
  tokens: { access_token: string; refresh_token?: string; expires_in?: number },
) {
  response.cookies.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: tokens.expires_in ?? 3600,
  });

  if (tokens.refresh_token) {
    response.cookies.set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  }
}

// Helper to try refreshing the token
async function tryRefreshToken(
  refreshTokenValue: string,
): Promise<AuthTokens | null> {
  try {
    return await refreshToken(refreshTokenValue);
  } catch (error) {
    console.error("Token refresh failed", error);
    return null;
  }
}

// Helper to verify access token is still valid
async function isTokenValid(token: string): Promise<boolean> {
  try {
    await getMe(token);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Handle token from URL (redirect from Core)
  const urlToken =
    searchParams.get("token") ??
    searchParams.get("access_token") ??
    searchParams.get("JWT");
  const urlRefreshToken = searchParams.get("refresh_token");

  if (urlToken) {
    try {
      await getMe(urlToken);

      const newUrl = request.nextUrl.clone();
      newUrl.searchParams.delete("token");
      newUrl.searchParams.delete("access_token");
      newUrl.searchParams.delete("JWT");
      newUrl.searchParams.delete("refresh_token");

      const response = NextResponse.redirect(newUrl);

      setAuthCookies(response, {
        access_token: urlToken,
        refresh_token: urlRefreshToken ?? undefined,
        expires_in: 3600,
      });

      return response;
    } catch (e) {
      console.error("Token verification error", e);
    }
  }

  // 2. Define Public Routes
  const publicRoutes = [
    "/auth/login",
    "/auth/access-denied",
    "/privacy-policy",
    "/terms-and-conditions",
    "/api/trpc",
    "/api/health",
    "/api/webhooks",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 3. Check Cookies
  const accessToken = request.cookies.get("access_token");
  const refreshTokenCookie = request.cookies.get("refresh_token");

  // 4. If access token exists, verify it's still valid
  if (accessToken) {
    const tokenValid = await isTokenValid(accessToken.value);

    if (tokenValid) {
      // Token is valid, allow request
      if (pathname === "/auth/login") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }

    // Token expired - try to refresh
    if (refreshTokenCookie) {
      const newTokens = await tryRefreshToken(refreshTokenCookie.value);

      if (newTokens) {
        let response: NextResponse;
        if (pathname === "/auth/login") {
          response = NextResponse.redirect(new URL("/", request.url));
        } else {
          response = NextResponse.next();
        }

        setAuthCookies(response, newTokens);
        return response;
      }
    }

    // Token expired and refresh failed - clear cookies and redirect
    if (!isPublicRoute) {
      const response = NextResponse.redirect(new URL(CORE_FRONTEND_URL));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  // 5. No access token but has refresh token - try to refresh
  if (!accessToken && refreshTokenCookie) {
    const newTokens = await tryRefreshToken(refreshTokenCookie.value);

    if (newTokens) {
      let response: NextResponse;
      if (pathname === "/auth/login") {
        response = NextResponse.redirect(new URL("/", request.url));
      } else {
        response = NextResponse.next();
      }

      setAuthCookies(response, newTokens);
      return response;
    }
  }

  // 6. Allow Public Routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 7. Redirect to Core Login
  const response = NextResponse.redirect(new URL(CORE_FRONTEND_URL));
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
