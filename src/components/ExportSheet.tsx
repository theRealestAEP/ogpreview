import { forwardRef } from 'react'
import type { OGData } from '../lib/og'
import { Specimen } from './Specimen'
import { SlackPreview } from './previews/SlackPreview'
import { DiscordPreview } from './previews/DiscordPreview'
import { TwitterPreview } from './previews/TwitterPreview'
import { IMessagePreview } from './previews/IMessagePreview'
import { LinkedInPreview } from './previews/LinkedInPreview'
import { FacebookPreview } from './previews/FacebookPreview'

// External images must be same-origin for html-to-image to embed them,
// so the sheet loads them through the dev server's og-proxy.
const proxied = (u: string) =>
  /^https?:\/\//i.test(u) ? `/api/og-proxy?url=${encodeURIComponent(u)}` : u

/** Fixed-width sheet rendered off-screen, only while an export runs. */
export const ExportSheet = forwardRef<HTMLDivElement, { og: OGData }>(
  function ExportSheet({ og }, ref) {
    const sheetOg = { ...og, image: proxied(og.image), favicon: proxied(og.favicon) }
    // The offset lives on this wrapper, NOT on the captured node:
    // html-to-image copies the target's computed position/left onto its
    // clone, so capturing an off-screen-positioned node paints all the
    // content 20000px outside the canvas (a solid-background PNG).
    return (
      <div className="fixed left-[-20000px] top-0">
        <div
          ref={ref}
          className="w-[1560px] bg-zinc-950 p-12 font-sans text-zinc-300"
        >
        <header className="mb-8 flex items-baseline justify-between">
          <h1 className="font-mono text-lg tracking-[0.2em] text-zinc-100">
            OG<span className="text-zinc-600">/</span>VIEWER
          </h1>
          <p className="font-mono text-sm text-zinc-500">
            {og.url} · {new Date().toISOString().slice(0, 10)}
          </p>
        </header>
        <div className="grid grid-cols-2 gap-10">
          <Specimen label="Slack" note="thread unfurl">
            <SlackPreview og={sheetOg} />
          </Specimen>
          <Specimen label="Discord" note="embed">
            <DiscordPreview og={sheetOg} />
          </Specimen>
          <Specimen label="X / Twitter" note={og.twitterCard}>
            <TwitterPreview og={sheetOg} />
          </Specimen>
          <Specimen label="iMessage" note="rich link">
            <IMessagePreview og={sheetOg} />
          </Specimen>
          <Specimen label="LinkedIn" note="feed post">
            <LinkedInPreview og={sheetOg} />
          </Specimen>
          <Specimen label="Facebook" note="feed post">
            <FacebookPreview og={sheetOg} />
          </Specimen>
          </div>
        </div>
      </div>
    )
  },
)
