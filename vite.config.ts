import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Same-origin proxy so the client can read OG tags from any URL without
// CORS or flaky public proxies. Only available while the Vite server runs.
function ogProxy(): Plugin {
  const handler = async (req: IncomingMessage, res: ServerResponse) => {
    const target = new URL(req.url ?? '', 'http://localhost').searchParams.get('url')
    if (!target || !/^https?:\/\//i.test(target)) {
      res.statusCode = 400
      res.end('missing or invalid ?url=')
      return
    }
    try {
      const upstream = await fetch(target, {
        signal: AbortSignal.timeout(10_000),
        redirect: 'follow',
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; OGViewer/1.0; +http://localhost)',
          accept: 'text/html,application/xhtml+xml,image/*,*/*',
        },
      })
      res.statusCode = upstream.status
      // Pass the upstream type through so this endpoint can also proxy
      // images (the PNG export loads og:image same-origin to avoid
      // tainting the canvas).
      res.setHeader(
        'content-type',
        upstream.headers.get('content-type') ?? 'application/octet-stream',
      )
      res.end(Buffer.from(await upstream.arrayBuffer()))
    } catch {
      res.statusCode = 502
      res.end('upstream fetch failed or timed out')
    }
  }
  return {
    name: 'og-proxy',
    configureServer(server) {
      server.middlewares.use('/api/og-proxy', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/og-proxy', handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ogProxy()],
})
