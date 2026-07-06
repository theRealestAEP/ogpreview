import type { OGData } from '../../lib/og'
import { hideOnError } from '../Specimen'

export function DiscordPreview({ og }: { og: OGData }) {
  return (
    <div className="bg-[#313338] p-4 font-sans text-[#dbdee1]">
      <div className="flex gap-3.5">
        <div className="h-10 w-10 shrink-0 rounded-full bg-[#5865f2]" />
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-medium text-[#f2f3f5]">alex</span>
            <span className="text-xs text-[#949ba4]">Today at 12:52 PM</span>
          </div>
          <a
            className="break-all text-[15px] text-[#00a8fc] hover:underline"
            href={og.url}
          >
            {og.url}
          </a>

          {/* embed */}
          <div
            className="mt-1.5 grid max-w-[432px] rounded border-l-4 bg-[#2b2d31] py-2 pl-3 pr-4"
            style={{ borderLeftColor: og.themeColor || '#1e1f22' }}
          >
            <span className="mt-1 text-xs text-[#b5bac1]">{og.siteName}</span>
            <a
              className="mt-1 text-base font-semibold text-[#00a8fc] hover:underline"
              href={og.url}
            >
              {og.title}
            </a>
            {og.description && (
              <p className="mt-1 line-clamp-4 text-sm leading-[1.375]">
                {og.description}
              </p>
            )}
            {og.image && (
              <img
                src={og.image}
                key={og.image}
                onError={hideOnError}
                className="mb-1 mt-3 max-h-[225px] rounded object-cover"
                alt=""
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
