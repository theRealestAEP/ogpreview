import type { ReactNode } from 'react'

interface Props {
  label: string
  note?: string
  children: ReactNode
}

/** Labeled frame each platform preview sits inside. */
export function Specimen({ label, note, children }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-baseline justify-between px-0.5">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500">
          {label}
        </h2>
        {note && (
          <span className="font-mono text-[10px] tracking-wide text-zinc-600">
            {note}
          </span>
        )}
      </header>
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        {children}
      </div>
    </section>
  )
}

/**
 * Hides an <img> whose src failed to load. Callers must also set
 * key={src} so React remounts the element when the src changes —
 * otherwise the inline display:none sticks to the reused element
 * and the next (valid) image never shows.
 */
export function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}
