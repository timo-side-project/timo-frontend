export const stripDevCookieAttributes = (cookie: string) => {
  return cookie
    .split(';')
    .filter((part) => {
      const trimmed = part.trim().toLowerCase();
      return !trimmed.startsWith('domain=') && trimmed !== 'secure';
    })
    .join('; ');
};
