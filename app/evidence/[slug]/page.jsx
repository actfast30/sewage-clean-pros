import { notFound } from 'next/navigation';
import { database, ensureDraftTable } from '@/lib/ranking-factory-db';
import sanitizeHtml from 'sanitize-html';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return {};
  try {
    const sql = database();
    await ensureDraftTable(sql);
    const rows = await sql`SELECT title,excerpt FROM ranking_factory_drafts WHERE slug=${slug} AND status='published' LIMIT 1`;
    if (!rows.length) return {};
    return { title: rows[0].title, description: rows[0].excerpt || undefined, alternates: { canonical: 'https://www.sewagecleanpros.com/evidence/' + slug } };
  } catch { return {}; }
}
export default async function EvidencePage({ params }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) notFound();
  let rows;
  try {
    const sql = database();
    await ensureDraftTable(sql);
    rows = await sql`SELECT title,html FROM ranking_factory_drafts WHERE slug=${slug} AND status='published' LIMIT 1`;
  } catch { notFound(); }
  if (!rows.length) notFound();
  const safe = sanitizeHtml(rows[0].html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1','h2','img']),
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ['src','alt','title','width','height'] },
    allowedSchemes: ['http','https'],
    allowedSchemesAppliedToAttributes: ['href','src'],
    disallowedTagsMode: 'discard'
  });
  return <><section className="inner-hero"><div className="wrap"><h1>{rows[0].title}</h1><p>Educational information from Sewage Clean Pros</p></div></section><div className="wrap content-layout"><article className="prose"><p>Sewage Clean Pros is a connection service. Independent providers perform cleanup where available.</p><div dangerouslySetInnerHTML={{ __html: safe }} /><p><Link href="/contact">Contact Sewage Clean Pros</Link></p></article></div></>;
}
