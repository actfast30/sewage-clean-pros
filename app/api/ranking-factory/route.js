import { createHmac, timingSafeEqual } from 'node:crypto';
import { database, ensureDraftTable, slugFromTitle } from '@/lib/ranking-factory-db';

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
  let post;
  try {
    post = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  if (post.type !== 'post.created' || typeof post.title !== 'string' ||
      typeof post.html !== 'string' || !post.title.trim() || !post.html.trim() ||
      post.title.length > 300 || post.html.length > 500000 ||
      (post.externalId != null && typeof post.externalId !== 'string')) {
    return Response.json({ error: 'Invalid article payload.' }, { status: 400 });
  }
  try {
    const sql = database();
    await ensureDraftTable(sql);
    const externalId = post.externalId || null;
    if (externalId) {
      const existing = await sql`SELECT slug, status FROM ranking_factory_drafts WHERE external_id = ${externalId} LIMIT 1`;
      if (existing.length) return Response.json({ status: existing[0].status, slug: existing[0].slug });
    }
    const slug = slugFromTitle(post.title) + '-' +
      createHmac('sha256', 'rf-draft-slug').update(externalId || rawBody).digest('hex').slice(0, 10);
    await sql`
      INSERT INTO ranking_factory_drafts
        (external_id, slug, title, html, excerpt, image_url, video_url, section, category, source)
      VALUES (
        ${externalId}, ${slug}, ${post.title}, ${post.html},
        ${post.excerpt || null}, ${post.imageUrl || null}, ${post.videoUrl || null},
        ${post.section || null}, ${post.category || null}, ${post.source || null}
      )
      ON CONFLICT (slug) DO NOTHING
    `;
    // Deliberately return no URL: content is saved for review, not public.
    return Response.json({ status: 'draft', slug });
  } catch (error) {
    console.error('Ranking Factory draft storage failed:', error.message);
    return Response.json({ error: 'Could not save draft.' }, { status: 503 });
  }
}

export async function PUT() {
  return Response.json({ error: 'Updates are not enabled.' }, { status: 405 });
}
