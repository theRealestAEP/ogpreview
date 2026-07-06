import type { OGData } from '../../lib/og'
import { hostOf } from '../../lib/og'
import { hideOnError } from '../Specimen'

export function IMessagePreview({ og }: { og: OGData }) {
  return (
    <div className="bg-white p-4 font-sans">
      <div className="flex flex-col items-end gap-2">
        <div className="max-w-[280px] overflow-hidden rounded-[18px] bg-[#e9e9eb]">
          {og.image && (
            <img
              src={og.image}
              key={og.image}
              onError={hideOnError}
              className="aspect-[1.91/1] w-full object-cover"
              alt=""
            />
          )}
          <div className="px-3 py-2">
            <p className="line-clamp-2 text-[13px] font-semibold leading-tight text-black">
              {og.title}
            </p>
            <p className="mt-0.5 text-xs text-[#8e8e93]">{hostOf(og.url)}</p>
          </div>
        </div>
        <div className="rounded-[18px] bg-[#0a84ff] px-3.5 py-1.5 text-[15px] text-white">
          worth a look
        </div>
      </div>
    </div>
  )
}
