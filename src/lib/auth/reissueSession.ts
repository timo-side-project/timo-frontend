import type { NextRequest } from 'next/server';

import { USER_ENDPOINTS } from '@/src/components/features/users/constants/url';
import { sanitizeProxyHeaders } from '@/src/lib/proxy/sanitizeProxyHeaders';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const reissueSession = async (request: NextRequest) => {
  const reissueUrl = `${API_BASE_URL}${USER_ENDPOINTS.reissue}`;
  const headers = sanitizeProxyHeaders(request.headers, reissueUrl);

  const res = await fetch(reissueUrl, {
    method: 'POST',
    headers,
    cache: 'no-store',
    signal: AbortSignal.timeout(3000),
  });

  if (!res.ok) {
    throw new Error('reissue failed');
  }

  return res.headers.getSetCookie();
};
