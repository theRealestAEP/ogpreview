import type { OGData } from '../../lib/og'
import { hostOf } from '../../lib/og'
import { hideOnError } from '../Specimen'

export function LinkedInPreview({ og }: { og: OGData }) {
  return (
    <div className="bg-[#f4f2ee] p-4 font-sans">
      <div className="max-w-[500px] overflow-hidden rounded-lg border border-black/10 bg-white">
        <div className="flex items-center gap-2 px-4 pt-3">
          <div className="h-12 w-12 rounded-full bg-[#0a66c2]" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-black/90">Alex Pickett</p>
            <p className="text-xs text-black/60">2h · 🌐</p>
          </div>
        </div>
        <p className="px-4 py-2 text-sm text-black/90">
          Sharing this with my network.
        </p>
        {og.image && (
          <img
            src={og.image}
            key={og.image}
            onError={hideOnError}
            className="aspect-[1.91/1] w-full object-cover"
            alt=""
          />
        )}
        <div className="bg-[#eef3f8] px-4 py-2">
          <p className="truncate text-sm font-semibold text-black/90">
            {og.title}
          </p>
          <p className="mt-0.5 text-xs text-black/60">{hostOf(og.url)}</p>
        </div>
      </div>
    </div>
  )
}
