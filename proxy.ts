import { type NextRequest, NextResponse } from 'next/server';

import { USER_ENDPOINTS } from './src/components/features/users/constants/url';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const isTokenExpired = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    const payload = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)),
      ),
    );
    return !payload.exp || payload.exp * 1000 < Date.now() + 5000;
  } catch {
    return true;
  }
};

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  console.log('[proxy] accessToken 존재:', !!accessToken);
  console.log('[proxy] refreshToken 존재:', !!refreshToken);

  if (accessToken && !isTokenExpired(accessToken)) {
    console.log('[proxy] accessToken 유효 → 통과');
    return NextResponse.next();
  }

  console.log('[proxy] accessToken 없거나 만료 → reissue 시도');

  if (!refreshToken) {
    console.log('[proxy] refreshToken 없음 → onboarding 리다이렉트');
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  try {
    const reissueUrl = `${API_BASE_URL}${USER_ENDPOINTS.reissue}`;
    const headers = new Headers(request.headers);
    headers.set('host', new URL(reissueUrl).host);
    headers.delete('origin');
    headers.delete('referer');
    headers.delete('x-middleware-invoke');

    console.log('[proxy] reissue 요청 URL:', reissueUrl);
    console.log('[proxy] reissue 요청 Cookie 존재:', !!headers.get('cookie'));

    const res = await fetch(reissueUrl, {
      method: 'POST',
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    console.log('[proxy] reissue 응답 status:', res.status);

    if (!res.ok) {
      const body = await res.text();
      console.log('[proxy] reissue 실패 body:', body);
      throw new Error('reissue failed');
    }

    const setCookies = res.headers.getSetCookie();
    console.log('[proxy] reissue 성공 setCookies:', setCookies);

    const redirectResponse = NextResponse.redirect(request.url);
    const isDev = process.env.NODE_ENV === 'development';

    setCookies.forEach((cookie) => {
      const modifiedCookie = isDev
        ? cookie
            .split(';')
            .filter((part) => {
              const trimmed = part.trim().toLowerCase();
              return !trimmed.startsWith('domain=') && trimmed !== 'secure';
            })
            .join('; ')
        : cookie;
      redirectResponse.headers.append('set-cookie', modifiedCookie);
    });

    return redirectResponse;
  } catch (e) {
    console.error('[proxy] reissue 실패 → login 리다이렉트', e);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('refresh_token');
    return response;
  }
}

export const config = {
  matcher: ['/', '/statistics'],
};
