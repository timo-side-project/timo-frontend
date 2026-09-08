import * as Sentry from '@sentry/nextjs';
import { type NextRequest, NextResponse } from 'next/server';

import { isApiError } from '@/src/lib/api/error';
import { isTokenExpired } from '@/src/lib/auth/isTokenExpired';
import { reissueSession } from '@/src/lib/auth/reissueSession';
import { stripDevCookieAttributes } from '@/src/lib/proxy/stripDevCookieAttributes';

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  try {
    const setCookies = await reissueSession(request);

    const redirectResponse = NextResponse.redirect(request.url);
    const isDev = process.env.NODE_ENV === 'development';

    setCookies.forEach((cookie) => {
      const modifiedCookie = isDev ? stripDevCookieAttributes(cookie) : cookie;
      redirectResponse.headers.append('set-cookie', modifiedCookie);
    });

    return redirectResponse;
  } catch (error) {
    const isExpiredRefreshToken = isApiError(error) && error.status === 401;

    if (!isExpiredRefreshToken) {
      Sentry.captureException(error);
    }

    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('refresh_token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|onboarding).*)',
  ],
};
