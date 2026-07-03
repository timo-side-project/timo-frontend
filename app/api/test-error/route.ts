import { captureException, flush } from '@sentry/nextjs';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const secret = req.headers.get('x-test-secret');
    if (!secret || secret !== process.env.TEST_ERROR_SECRET) {
      return new Response('Not found', { status: 404 });
    }
  }

  const error = new Error(`Sentry webhook test - ${Date.now()}`);
  captureException(error);
  await flush(2000);
  throw error;
}
