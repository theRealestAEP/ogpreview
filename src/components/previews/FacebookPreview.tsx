import type { OGData } from '../../lib/og'
import { hostOf } from '../../lib/og'
import { hideOnError } from '../Specimen'

export function FacebookPreview({ og }: { og: OGData }) {
  return (
    <div className="bg-[#f0f2f5] p-4 font-sans">
      <div className="max-w-[500px] overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <div className="h-10 w-10 rounded-full bg-[#1877f2]" />
          <div className="leading-tight">
            <p className="text-[15px] font-semibold text-[#050505]">Alex Pickett</p>
            <p className="text-[13px] text-[#65676b]">Just now · 🌎</p>
          </div>
        </div>
        {og.image && (
          <img
            src={og.image}
            key={og.image}
            onError={hideOnError}
            className="aspect-[1.91/1] w-full object-cover"
            alt=""
          />
        )}
        <div className="border-b border-black/10 bg-[#f0f2f5] px-4 py-2.5">
          <p className="text-[13px] uppercase text-[#65676b]">{hostOf(og.url)}</p>
          <p className="mt-0.5 truncate text-[17px] font-semibold text-[#050505]">
            {og.title}
          </p>
          {og.description && (
            <p className="mt-0.5 truncate text-[15px] text-[#65676b]">
              {og.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
