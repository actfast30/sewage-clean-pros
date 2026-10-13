import { createHmac, timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';

function verify(request, rawBody, secret) {
  const id = request.headers.get('webhook-id');
  const timestamp = request.headers.get('webhook-timestamp');
  const signatures = request.headers.get('webhook-signature') || '';
  if (!id || !timestamp || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const key = secret.startsWith('whsec_')
    ? Buffer.from(secret.slice(6), 'base64')
    : Buffer.from(secret, 'utf8');
  const expected = Buffer.from(
    'v1,' + createHmac('sha256', key)
      .update(id + '.' + timestamp + '.' + rawBody)
      .digest('base64')
  );
  return signatures.split(/\s+/).some((value) => {
    const actual = Buffer.from(value);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  });
}

export async function POST(request) {
  const secret = process.env.RANKING_FACTORY_SECRET;
  if (!secret) {
    return Response.json({ error: 'Publishing receiver is not configured.' }, { status: 503 });
  }
  const rawBody = await request.text();
  if (!verify(request, rawBody, secret)) {
    return Response.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  }
  // Fail closed until persistent draft storage and a review workflow are configured.
  // Never report success or a published URL for content that was not saved.
  return Response.json({ error: 'Draft storage is not configured yet.' }, { status: 503 });
}

export async function PUT() {
  return Response.json({ error: 'Updates are not enabled.' }, { status: 405 });
}
