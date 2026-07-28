import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosHeaders, isAxiosError } from 'axios';

import { USER_ENDPOINTS } from '@/src/components/features/users/constants/url';
import { API_BASE_URL } from '@/src/lib/config/env';

import type { ApiError } from './error';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { 'ngrok-skip-browser-warning': 'true' },
});

const reissueClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { 'ngrok-skip-browser-warning': 'true' },
});

let reissuePromise: Promise<void> | null = null;

const toApiError = (error: AxiosError): ApiError => {
  return {
    status: error.response?.status ?? null,
    code: error.code ?? null,
    message: error.message,
    detail: error.response?.data,
  };
};

const attachServerCookieHeader = async (config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    return config;
  }

  const headers = AxiosHeaders.from(config.headers);
  const hasCookieHeader = headers.has('cookie');

  if (hasCookieHeader) {
    return config;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieHeader = (await cookies()).toString();

    if (!cookieHeader) {
      return config;
    }

    headers.set('cookie', cookieHeader);
    config.headers = headers;
    return config;
  } catch (error) {
    const { unstable_rethrow } = await import('next/navigation');
    unstable_rethrow(error);
    return config;
  }
};

const rejectApiError = (error: AxiosError) => {
  return Promise.reject(toApiError(error));
};

const isReissueRequest = (config: RetryableRequestConfig) => {
  const requestUrl = config.url ?? '';

  try {
    const parsedUrl = new URL(requestUrl, API_BASE_URL ?? 'http://localhost');
    return parsedUrl.pathname === USER_ENDPOINTS.reissue;
  } catch {
    return requestUrl === USER_ENDPOINTS.reissue;
  }
};

const shouldTryReissue = (
  status: number | null,
  config: RetryableRequestConfig,
) => {
  return status === 401 && !isReissueRequest(config) && !config._retry;
};

const runReissueOnce = async () => {
  if (!reissuePromise) {
    reissuePromise = reissueClient
      .post(USER_ENDPOINTS.reissue)
      .then(() => undefined)
      .finally(() => {
        reissuePromise = null;
      });
  }

  await reissuePromise;
};

const retryRequest = (config: RetryableRequestConfig) => {
  config._retry = true;
  return api.request(config);
};

const logServerApiError = (error: AxiosError) => {
  if (typeof window !== 'undefined') {
    return;
  }

  const requestUrl = error.config?.url ?? '(unknown-url)';
  const status = error.response?.status ?? null;

  // eslint-disable-next-line no-console
  console.error('[api][ssr] request failed', {
    url: requestUrl,
    status,
  });
};

api.interceptors.request.use(
  async (config) => attachServerCookieHeader(config),
  (error: AxiosError) => rejectApiError(error),
);

reissueClient.interceptors.request.use(
  async (config) => attachServerCookieHeader(config),
  (error: AxiosError) => rejectApiError(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    logServerApiError(error);

    const originalConfig = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status ?? null;

    if (!originalConfig) {
      return rejectApiError(error);
    }

    if (!shouldTryReissue(status, originalConfig)) {
      return rejectApiError(error);
    }

    try {
      await runReissueOnce();
      return retryRequest(originalConfig);
    } catch (reissueError) {
      if (isAxiosError(reissueError)) {
        return rejectApiError(reissueError);
      }

      return rejectApiError(error);
    }
  },
);

export default api;
