export interface OGData {
  url: string
  title: string
  description: string
  image: string
  siteName: string
  favicon: string
  themeColor: string
  twitterCard: string
}

export const SAMPLE: OGData = {
  url: 'https://stripe.com/payments',
  title: 'Stripe Payments | Global Payment Processing Platform',
  description:
    'Capture more revenue with a unified payments solution that eliminates the need for one-off merchant account, payment gateway, and processor integrations.',
  image:
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop',
  siteName: 'Stripe',
  favicon: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=64',
  themeColor: '#635bff',
  twitterCard: 'summary_large_image',
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// The Vite dev server's own proxy first (see ogProxy in vite.config.ts),
// then public CORS proxies as fallback for static deployments.
const PROXIES = [
  (u: string) => `/api/og-proxy?url=${encodeURIComponent(u)}`,
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
]

const ATTEMPT_TIMEOUT_MS = 12_000

function meta(doc: Document, ...names: string[]): string {
  for (const name of names) {
    const el =
      doc.querySelector(`meta[property="${name}"]`) ??
      doc.querySelector(`meta[name="${name}"]`)
    const content = el?.getAttribute('content')?.trim()
    if (content) return content
  }
  return ''
}

function absolute(maybeRelative: string, base: string): string {
  if (!maybeRelative) return ''
  try {
    return new URL(maybeRelative, base).href
  } catch {
    return maybeRelative
  }
}

export async function fetchOG(rawUrl: string): Promise<OGData> {
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`

  let html = ''
  let lastError: unknown
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), {
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      html = await res.text()
      if (html) break
    } catch (err) {
      lastError = err
    }
  }
  if (!html) throw lastError ?? new Error('Could not fetch page')

  const doc = new DOMParser().parseFromString(html, 'text/html')

  return {
    url,
    title: meta(doc, 'og:title', 'twitter:title') || doc.title || hostOf(url),
    description: meta(doc, 'og:description', 'twitter:description', 'description'),
    image: absolute(meta(doc, 'og:image', 'og:image:url', 'twitter:image'), url),
    siteName: meta(doc, 'og:site_name') || hostOf(url),
    favicon: `https://www.google.com/s2/favicons?domain=${hostOf(url)}&sz=64`,
    themeColor: meta(doc, 'theme-color'),
    twitterCard: meta(doc, 'twitter:card') || 'summary_large_image',
  }
}
