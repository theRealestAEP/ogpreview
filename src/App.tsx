import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import type { OGData } from './lib/og'
import { SAMPLE, fetchOG, hostOf } from './lib/og'
import { ExportSheet } from './components/ExportSheet'
import { Specimen } from './components/Specimen'
import { SlackPreview } from './components/previews/SlackPreview'
import { DiscordPreview } from './components/previews/DiscordPreview'
import { TwitterPreview } from './components/previews/TwitterPreview'
import { IMessagePreview } from './components/previews/IMessagePreview'
import { LinkedInPreview } from './components/previews/LinkedInPreview'
import { FacebookPreview } from './components/previews/FacebookPreview'

const FIELDS: Array<{ key: keyof OGData; label: string; textarea?: boolean }> = [
  { key: 'title', label: 'og:title' },
  { key: 'description', label: 'og:description', textarea: true },
  { key: 'image', label: 'og:image' },
  { key: 'siteName', label: 'og:site_name' },
  { key: 'themeColor', label: 'theme-color' },
]

export default function App() {
  const [input, setInput] = useState('')
  const [og, setOg] = useState<OGData>(SAMPLE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    if (!input.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      setOg(await fetchOG(input.trim()))
    } catch {
      setError('Could not fetch that URL — check it, or fill the fields in manually.')
    } finally {
      setLoading(false)
    }
  }

  const set = (key: keyof OGData) => (value: string) =>
    setOg((prev) => ({ ...prev, [key]: value }))

  const sheetRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  async function exportPng() {
    if (exporting) return
    setExporting(true)
    setError('')
    try {
      // The sheet mounts when `exporting` flips true — wait for its ref.
      let node: HTMLDivElement | null = null
      for (let i = 0; i < 100 && !(node = sheetRef.current); i++) {
        await new Promise((r) => setTimeout(r, 20))
      }
      if (!node) throw new Error('export sheet never mounted')
      await Promise.all(
        Array.from(node.querySelectorAll('img')).map(
          (img) =>
            img.complete ||
            new Promise((r) => {
              img.onload = img.onerror = () => r(null)
            }),
        ),
      )
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: '#09090b',
        skipFonts: true,
        // Without this, html-to-image strips query strings when caching
        // fetched resources — and every sheet image is /api/og-proxy?url=…,
        // so all images collapse to one cache entry and exports reuse the
        // first image ever fetched.
        includeQueryParams: true,
        // A resource that fails to fetch (e.g. a 404 favicon) otherwise
        // becomes src="" on the cloned <img>, whose error event rejects
        // the whole export.
        imagePlaceholder:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        // ...and if one still slips through and fails to decode, skip it
        // instead of rejecting the whole export.
        onImageErrorHandler: () => undefined,
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `og-sheet-${hostOf(og.url)}.png`
      a.click()
    } catch (err) {
      console.error('[export]', err)
      setError('Export failed — try fetching the URL again first.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-300">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <h1 className="shrink-0 font-mono text-sm tracking-[0.2em] text-zinc-100">
            OG<span className="text-zinc-600">/</span>VIEWER
          </h1>
          <form
            className="flex flex-1 gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              load()
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://example.com"
              spellCheck={false}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-md bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-950 hover:bg-white disabled:opacity-50"
            >
              {loading ? 'Fetching…' : 'Fetch'}
            </button>
          </form>
          <button
            type="button"
            onClick={exportPng}
            disabled={exporting}
            className="shrink-0 rounded-md border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:text-white disabled:opacity-50"
          >
            {exporting ? 'Exporting…' : 'Export PNG'}
          </button>
        </div>
        {error && (
          <p className="mx-auto max-w-6xl px-6 pb-2 text-sm text-red-400">{error}</p>
        )}
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-8 lg:grid-cols-[280px_1fr]">
        {/* editable tag values */}
        <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-20">
          {FIELDS.map(({ key, label, textarea }) => (
            <label key={key} className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                {label}
              </span>
              {textarea ? (
                <textarea
                  value={og[key]}
                  rows={4}
                  onChange={(e) => set(key)(e.target.value)}
                  className="resize-none rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none"
                />
              ) : (
                <input
                  value={og[key]}
                  spellCheck={false}
                  onChange={(e) => set(key)(e.target.value)}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none"
                />
              )}
            </label>
          ))}
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500">
              twitter:card
            </span>
            <select
              value={og.twitterCard}
              onChange={(e) => set('twitterCard')(e.target.value)}
              className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-200 focus:border-zinc-600 focus:outline-none"
            >
              <option value="summary_large_image">summary_large_image</option>
              <option value="summary">summary</option>
            </select>
          </label>
          <p className="mt-2 border-t border-zinc-900 pt-3 font-mono text-[10px] leading-relaxed text-zinc-600">
            Recommended og:image — 1200 × 630 (1.91:1). Edits apply to every
            preview immediately.
          </p>
        </aside>

        {/* specimen grid */}
        <div className="grid gap-8 xl:grid-cols-2">
          <Specimen label="Slack" note="thread unfurl">
            <SlackPreview og={og} />
          </Specimen>
          <Specimen label="Discord" note="embed">
            <DiscordPreview og={og} />
          </Specimen>
          <Specimen label="X / Twitter" note={og.twitterCard}>
            <TwitterPreview og={og} />
          </Specimen>
          <Specimen label="iMessage" note="rich link">
            <IMessagePreview og={og} />
          </Specimen>
          <Specimen label="LinkedIn" note="feed post">
            <LinkedInPreview og={og} />
          </Specimen>
          <Specimen label="Facebook" note="feed post">
            <FacebookPreview og={og} />
          </Specimen>
        </div>
      </main>

      {exporting && <ExportSheet ref={sheetRef} og={og} />}
    </div>
  )
}
