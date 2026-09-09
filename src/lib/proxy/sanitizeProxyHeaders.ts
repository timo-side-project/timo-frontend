export const sanitizeProxyHeaders = (
  sourceHeaders: Headers,
  targetUrl: string,
) => {
  const headers = new Headers(sourceHeaders);
  headers.set('host', new URL(targetUrl).host);
  headers.delete('origin');
  headers.delete('referer');
  headers.delete('x-middleware-invoke');
  return headers;
};
