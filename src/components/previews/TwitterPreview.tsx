import type { OGData } from '../../lib/og'
import { hostOf } from '../../lib/og'
import { hideOnError } from '../Specimen'

export function TwitterPreview({ og }: { og: OGData }) {
  const large = og.twitterCard !== 'summary'
  return (
    <div className="bg-black p-4 font-sans text-[#e7e9ea]">
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#1d9bf0] to-[#0f4c75]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[15px]">
            <span className="font-bold">Alex</span>
            <span className="text-[#71767b]">@alex · 2m</span>
          </div>
          <p className="text-[15px]">check this out</p>

          {large ? (
            <div className="mt-3 max-w-[516px]">
              <div className="relative overflow-hidden rounded-2xl border border-[#2f3336]">
                {og.image ? (
                  <img
                    src={og.image}
                    key={og.image}
                    onError={hideOnError}
                    className="aspect-[1.91/1] w-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-[#16181c] text-[#71767b]">
                    no og:image
                  </div>
                )}
                <span className="absolute bottom-3 left-3 max-w-[90%] truncate rounded bg-black/75 px-1.5 py-0.5 text-[13px] text-white">
                  {og.title}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-[#71767b]">
                From {hostOf(og.url)}
              </p>
            </div>
          ) : (
            <div className="mt-3 flex max-w-[516px] overflow-hidden rounded-2xl border border-[#2f3336]">
              <div className="h-[129px] w-[129px] shrink-0 border-r border-[#2f3336] bg-[#16181c]">
                {og.image && (
                  <img
                    src={og.image}
                    key={og.image}
                    onError={hideOnError}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-col justify-center gap-0.5 px-3 text-[15px]">
                <span className="text-[#71767b]">{hostOf(og.url)}</span>
                <span className="truncate">{og.title}</span>
                <span className="line-clamp-2 text-[#71767b]">
                  {og.description}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
