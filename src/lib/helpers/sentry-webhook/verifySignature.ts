export async function verifySentrySignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const hexSignature = signature.startsWith('sha256=')
    ? signature.slice(7)
    : signature;

  const signatureBytes = new Uint8Array(
    (hexSignature.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)),
  );

  return crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    encoder.encode(body),
  );
}
