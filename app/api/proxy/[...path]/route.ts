import { type NextRequest, NextResponse } from 'next/server';

import { sanitizeProxyHeaders } from '@/src/lib/proxy/sanitizeProxyHeaders';
import { stripDevCookieAttributes } from '@/src/lib/proxy/stripDevCookieAttributes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }

  const { path: pathSegments } = await params;
  const path = pathSegments?.join('/') || '';

  const targetUrl = `${API_BASE_URL}/${path}${req.nextUrl.search}`;

  const headers = sanitizeProxyHeaders(req.headers, targetUrl);

  try {
    const apiResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.body,
      // @ts-expect-error: TypeScript가 fetch의 duplex 옵션을 표준 타입에서 지원하지 않아서 발생하는 타입 에러 (있어야 동작)
      duplex: 'half',
      cache: 'no-store',
    });
    const responseHeaders = new Headers(apiResponse.headers);

    responseHeaders.delete('Set-Cookie');

    const setCookieHeaders = apiResponse.headers.getSetCookie();
    setCookieHeaders.forEach((cookie) => {
      responseHeaders.append('Set-Cookie', stripDevCookieAttributes(cookie));
    });
    return new NextResponse(apiResponse.body, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { error: 'Proxy request failed.' },
      { status: 500 },
    );
  }
}

export {
  handler as DELETE,
  handler as GET,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
