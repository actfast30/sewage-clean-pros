import { timingSafeEqual } from 'node:crypto';
import { database, ensureDraftTable } from '@/lib/ranking-factory-db';
import sanitizeHtml from 'sanitize-html';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(request) {
  const expected = process.env.RANKING_FACTORY_ADMIN_PASSWORD;
  if (!expected || expected.length < 16) return false;
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;
  let decoded;
  try { decoded = Buffer.from(header.slice(6), 'base64').toString('utf8'); } catch { return false; }
  const password = decoded.slice(decoded.indexOf(':') + 1);
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function unauthorized() {
  return new Response('Administrator sign-in required.', {
    status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Sewage Clean Pros article review"', 'Cache-Control': 'no-store' }
  });
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
function page(body) {
  return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Article review</title><body style="font:16px system-ui;max-width:900px;margin:40px auto;padding:16px"><h1>Ranking Factory article review</h1><p>Review carefully before publishing. Do not approve invented jobs, testimonials, certifications or guarantees.</p>' + body + '</body></html>', { headers: { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store', 'X-Robots-Tag':'noindex, nofollow' } });
}

export async function GET(request) {
  if (!authorized(request)) return unauthorized();
  try {
    const sql = database();
    await ensureDraftTable(sql);
    const drafts = await sql`SELECT slug,title,html,status,created_at FROM ranking_factory_drafts ORDER BY created_at DESC LIMIT 100`;
    const body = drafts.length ? drafts.map(d => {
      const preview = sanitizeHtml(d.html, { allowedTags: [], allowedAttributes: {} }).slice(0, 3500);
      return '<section style="border:1px solid #aaa;padding:20px;margin:20px 0"><h2>' + escapeHtml(d.title) +
        '</h2><p>Status: <strong>' + escapeHtml(d.status) + '</strong></p><details><summary>Read article text</summary><div style="white-space:pre-wrap">' +
        escapeHtml(preview) + '</div></details>' +
        (d.status === 'draft' ? '<form method="post"><input type="hidden" name="slug" value="' + escapeHtml(d.slug) +
        '"><button name="action" value="publish" style="margin-top:12px;padding:8px">Approve and publish</button></form>' : '<p>Public URL: <a href="/evidence/' + encodeURIComponent(d.slug) + '">/evidence/' + escapeHtml(d.slug) + '</a></p>') + '</section>';
    }).join('') : '<p>No articles received yet.</p>';
    return page(body);
  } catch {
    return page('<p>Database unavailable. Check the database connection.</p>');
  }
}

export async function POST(request) {
  if (!authorized(request)) return unauthorized();
  const origin = request.headers.get('origin');
  if (origin !== new URL(request.url).origin) return new Response('Invalid origin', { status: 403 });
  const form = await request.formData();
  const slug = String(form.get('slug') || '');
  if (form.get('action') !== 'publish' || !/^[a-z0-9-]{1,120}$/.test(slug)) {
    return new Response('Invalid request', { status: 400 });
  }
  try {
    const sql = database();
    await ensureDraftTable(sql);
    await sql`UPDATE ranking_factory_drafts SET status='published',updated_at=now() WHERE slug=${slug} AND status='draft'`;
    return Response.redirect(new URL('/api/ranking-factory/review', request.url), 303);
  } catch {
    return new Response('Could not publish. Please try again.', { status: 503 });
  }
}
