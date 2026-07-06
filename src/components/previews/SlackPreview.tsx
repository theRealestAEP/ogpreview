import type { OGData } from '../../lib/og'
import { hideOnError } from '../Specimen'

export function SlackPreview({ og }: { og: OGData }) {
  return (
    <div className="bg-white p-4 font-sans text-[15px] leading-[1.46668] text-[#1d1c1d]">
      <div className="flex gap-2">
        <div className="h-9 w-9 shrink-0 rounded bg-gradient-to-br from-[#e01e5a] to-[#ecb22e]" />
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-[900]">alex</span>
            <span className="text-xs text-[#616061]">12:52 PM</span>
          </div>
          <a className="break-all text-[#1264a3] hover:underline" href={og.url}>
            {og.url}
          </a>

          {/* unfurl */}
          <div className="mt-1.5 flex max-w-[520px]">
            <div className="w-1 shrink-0 rounded-full bg-[#dddddd]" />
            <div className="min-w-0 pl-3">
              <div className="flex items-center gap-2">
                {og.favicon && (
                  <img
                    src={og.favicon}
                    key={og.favicon}
                    onError={hideOnError}
                    className="h-4 w-4 rounded-sm"
                    alt=""
                  />
                )}
                <span className="font-[900] text-[#1d1c1d]">{og.siteName}</span>
              </div>
              <a
                className="mt-0.5 block font-[900] text-[#1264a3] hover:underline"
                href={og.url}
              >
                {og.title}
              </a>
              {og.description && (
                <p className="mt-0.5 line-clamp-3">{og.description}</p>
              )}
              {og.image && (
                <img
                  src={og.image}
                  key={og.image}
                  onError={hideOnError}
                  className="mt-2 max-h-[192px] max-w-[min(360px,100%)] rounded-lg border border-black/10 object-cover"
                  alt=""
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
