# Sewage Clean Pros — Next.js Website

A responsive nationwide sewage cleanup connection website for `sewagecleanpros.com`.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Create a new GitHub repository (keep separate from your dumpster directory).
2. Upload the project files to the repository root.
3. In Vercel, import the repository and deploy with the Next.js preset.
4. Preview the `.vercel.app` URL before adding your IONOS domain.
5. Add `sewagecleanpros.com` and `www.sewagecleanpros.com` under Vercel Project → Settings → Domains. Follow Vercel's displayed DNS records in IONOS. Do not purchase a separate SSL certificate; Vercel provisions HTTPS for properly connected domains.
6. Once assigned, set `NEXT_PUBLIC_TRACKING_PHONE` under Vercel → Settings → Environment Variables and redeploy. Before then, Call Now buttons are intentionally disabled, not fake live phone numbers.

## Important launch checks

- Replace the **draft** Privacy Policy and Terms with reviewed versions identifying the operator and actual data handling.
- Confirm the brand/domain does not infringe a third party's mark.
- Verify rights, relevance and reliability of hero/service photos (currently remote Unsplash placeholders); replace with licensed restoration-specific imagery before launch.
- Review all 24 city pages for locally useful, verified details. They are useful starter pages but intentionally do **not** fabricate local contractor availability or city-specific facts. Enrich before requesting indexing.
- Confirm partner network's allowed marketing, disclosure, and call-tracking requirements.
- Submit `https://sewagecleanpros.com/sitemap.xml` to Search Console after connecting the domain.

## Included

- Responsive navy/white/gold homepage, services, how-it-works, resources, state and city pages.
- Metadata, Open Graph defaults, robots.txt and dynamic sitemap.xml.
- Service Areas linked only in footer and internal pages, not main navigation.
- No fake local office addresses, unverified ratings, or fabricated availability claims.
