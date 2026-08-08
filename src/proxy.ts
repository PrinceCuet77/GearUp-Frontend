import type { JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtUtils } from './lib/jwt';
import { cookies } from 'next/headers';
import { refreshTokenAction } from './app/(auth)/_actions/refreshTokenAction';

const AUTH_ROUTES = ['/login', '/register'];
const PUBLIC_ROUTES = ['/', '/gears', '/about'];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const cookie = await cookies();
  const pathname = request.nextUrl.pathname;

  // PROXY-1: Loggedin user trying to access login or register page, redirect them to their respective dashboard based on their role
  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let decodedAccessToken = accessToken
    ? (jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET!,
      ) as JwtPayload)
    : null;
  const decodedRefreshToken = refreshToken
    ? (jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as JwtPayload)
    : null;

  //access token has expired but refresh token is valid, get new access token from backend
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await refreshTokenAction();

    if (result.success) {
      accessToken = result.data.accessToken;

      cookie.set('accessToken', accessToken!, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'lax',
      });

      decodedAccessToken = jwtUtils.verifyToken(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string,
      );
    }
  }

  const isPublic = PUBLIC_ROUTES.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(route + '/');
  });
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  // If the refresh token is invalid/expired or missing, redirect to login (only for protected routes)
  if (
    !isPublic &&
    !isAuthRoute &&
    (!decodedRefreshToken || decodedRefreshToken.success === false)
  ) {
    cookie.delete('accessToken');
    cookie.delete('refreshToken');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If access token exists but is still invalid after refresh attempt, redirect to login (only for protected routes)
  if (
    !isPublic &&
    !isAuthRoute &&
    accessToken &&
    !decodedAccessToken?.success
  ) {
    cookie.delete('accessToken');
    cookie.delete('refreshToken');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role =
    decodedAccessToken && decodedAccessToken?.success
      ? (decodedAccessToken.data as JwtPayload)?.role
      : null;

  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/customer', request.url));
    } else if (role === 'PROVIDER') {
      return NextResponse.redirect(new URL('/provider', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // PROXY-2: Authentication check: If the user is not authenticated and trying to access a protected route, redirect them to the login page.
  if (!accessToken && !isPublic && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // PROXY-3: Role-based access control: If the user is authenticated but trying to access a route that doesn't match their role, redirect them to a "not authorized" page or their respective dashboard.
  if (pathname.startsWith('/customer') && role !== 'CUSTOMER') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  } else if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  } else if (pathname.startsWith('/provider') && role !== 'PROVIDER') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
