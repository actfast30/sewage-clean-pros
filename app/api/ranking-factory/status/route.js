import { createHmac, timingSafeEqual } from 'node:crypto';
import { database, ensureDraftTable } from '@/lib/ranking-factory-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function validSignature(request, secret) {
  const id = request.headers.get('webhook-id');
  const ts = request.headers.get('webhook-timestamp');
  const header = request.headers.get('webhook-signature') || '';
  if (!id || !ts || !/^\d+$/.test(ts) || Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const key = secret.startsWith('whsec_') ? Buffer.from(secret.slice(6), 'base64') : Buffer.from(secret, 'utf8');
  const expected = Buffer.from('v1,' + createHmac('sha256', key).update(id + '.' + ts + '.').digest('base64'));
  return header.split(/\s+/).some(signature => {
    const actual = Buffer.from(signature);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  });
}

export async function GET(request) {
  const secret = process.env.RANKING_FACTORY_SECRET;
  if (!secret) return Response.json({ error: 'Not configured' }, { status: 503 });
  if (!validSignature(request, secret)) return Response.json({ error: 'Invalid signature' }, { status: 401 });
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug || !/^[a-z0-9-]{1,120}$/.test(slug)) {
    return Response.json({ published: false, url: null, status: 'unknown' });
  }
  try {
    const sql = database();
    await ensureDraftTable(sql);
    const rows = await sql`SELECT status FROM ranking_factory_drafts WHERE slug=${slug} LIMIT 1`;
    const status = rows[0]?.status || 'unknown';
    const published = status === 'published';
    return Response.json({
      published,
      url: published ? 'https://www.sewagecleanpros.com/evidence/' + slug : null,
      status
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Database unavailable' }, { status: 503 });
  }
}
