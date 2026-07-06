# OG/Viewer

A minimal Open Graph previewer. Paste a URL and see how its link unfurls across the places OG tags actually get rendered — Slack, Discord, X/Twitter, iMessage, LinkedIn, and Facebook — side by side. Edit any tag value (title, description, image, etc.) and every preview updates live, so you can tune your copy before shipping the tags.

**Export PNG** downloads all six previews as a single high-res (2×) sheet — handy for sharing in a PR or design review.

![All six platform previews rendered for stripe.com](docs/og-sheet-stripe.png)

## Run it

```sh
npm install
npm run dev
```

Fetching works through a small proxy built into the Vite dev server (`/api/og-proxy`, see `vite.config.ts`), so it needs `npm run dev` or `vite preview`. If deployed statically it falls back to public CORS proxies, which are less reliable.

## Structure

- `src/lib/og.ts` — fetches a page, parses `og:*` / `twitter:*` / fallback meta tags
- `src/components/previews/` — one component per platform, all taking the same `OGData` prop; add a new surface by dropping in another component
- `src/components/ExportSheet.tsx` — fixed-width layout captured by the PNG export
