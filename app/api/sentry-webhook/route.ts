import { after, type NextRequest, NextResponse } from 'next/server';

import { processSentryEvent } from '@/src/lib/helpers/sentry-webhook/processor';
import type { SentryWebhookPayload } from '@/src/lib/helpers/sentry-webhook/types';
import { verifySentrySignature } from '@/src/lib/helpers/sentry-webhook/verifySignature';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('sentry-hook-signature');
  const secret = process.env.SENTRY_WEBHOOK_SECRET;

  if (secret) {
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }
    const isValid = await verifySentrySignature(rawBody, signature, secret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let payload: SentryWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as SentryWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!['triggered', 'created', 'unresolved'].includes(payload.action)) {
    return NextResponse.json({ status: 'ignored' });
  }

  after(async () => {
    try {
      await processSentryEvent(payload);
    } catch (error) {
      throw error;
    }
  });

  return NextResponse.json({ status: 'accepted' });
}
