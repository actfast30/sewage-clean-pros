import { neon } from '@neondatabase/serverless';

export function database() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL;
  if (!url) throw new Error('Database connection is not configured');
  return neon(url);
}

export async function ensureDraftTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS ranking_factory_drafts (
      id BIGSERIAL PRIMARY KEY,
      external_id TEXT UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      html TEXT NOT NULL,
      excerpt TEXT,
      image_url TEXT,
      video_url TEXT,
      section TEXT,
      category TEXT,
      source TEXT,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export function slugFromTitle(title) {
  return title.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 75) || 'article';
}
