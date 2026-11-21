import { Crown, Star, Trophy } from 'lucide-react'

export function Prizes() {
  return (
    <section id="hadiah" className="@container wrap scroll-mt-20">
      <h2 className="h-group group-head">Program Kompetisi Ide &amp; Startup</h2>
      <div className="bento">
        <div className="tile tile-amber col-span-2 flex min-h-[12.5rem] flex-col justify-end lg:col-span-4 lg:min-h-[19rem]">
          <Trophy
            className="absolute top-5 right-5 size-14 sm:top-7 sm:right-7 lg:size-16"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <div className="num text-[6.5rem] lg:text-[9rem]">10</div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-[1.6rem] leading-none font-extrabold tracking-[-0.03em]">Pemenang</span>
            <span className="rounded-full bg-ink px-3 py-1 text-sm font-semibold text-amber">2 gelombang</span>
          </div>
        </div>

        <div className="tile tile-emerald half flex min-h-[11rem] flex-col justify-between gap-6 lg:col-span-4">
          <span className="chip bg-amber text-ink">
            <Crown className="size-6" strokeWidth={1.9} aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-white/85">Peringkat 1 – 3</p>
            <p className="mt-1 text-[clamp(1.55rem,6.6vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-amber">
              Free of cost
            </p>
          </div>
        </div>

        <div className="tile tile-white half flex min-h-[11rem] flex-col justify-between gap-6 lg:col-span-4">
          <span className="chip bg-mist text-emerald">
            <Star className="size-6" strokeWidth={1.9} aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-muted-foreground">Peringkat 4 – 5</p>
            <p className="mt-1 text-[clamp(1.55rem,6.6vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.04em]">
              <span className="whitespace-nowrap">SAR 20,000</span> only
            </p>
          </div>
        </div>

        <p className="tile tile-white col-span-2 py-5 leading-relaxed font-medium lg:col-span-12 lg:px-9 lg:text-lg">
          Termasuk pendampingan pendirian perusahaan dan proses izin tinggal (Iqama) untuk 2 orang (Founder &amp;
          Co-founder / Investor).
        </p>
      </div>
    </section>
  )
}
