import { waUrl } from '@/lib/contact'
import { DEADLINE, WAVE2_CLOSES, WAVE2_OPENS, phaseAt } from '@/lib/waves'
import { useNow } from '@/lib/useNow'
import { WhatsAppIcon } from '@/components/icons'
import { Skyline } from '@/components/Skyline'

/**
 * The countdown follows the calendar: until wave 1 closes, then until wave 2
 * opens, then until wave 2 closes. After that the tile says so.
 */
const CLOCK = {
  wave1: { target: DEADLINE, label: 'Gelombang 1 tutup dalam', note: 'Pendaftaran hingga 25 Nov 2026' },
  between: {
    target: WAVE2_OPENS,
    label: 'Gelombang 2 dibuka dalam',
    note: 'Gelombang 1 sudah ditutup. Gelombang 2: Jan – Feb 2027',
  },
  wave2: { target: WAVE2_CLOSES, label: 'Gelombang 2 tutup dalam', note: 'Pendaftaran Gelombang 2: Jan – Feb 2027' },
}

function Clock() {
  const now = useNow(1000)
  const phase = now === null ? 'wave1' : phaseAt(now)

  if (phase === 'closed') {
    return (
      <div className="relative z-10">
        <p className="h-group">Pendaftaran sudah ditutup</p>
        <p className="mt-2 text-white/80">Terima kasih untuk semua proposal yang masuk.</p>
      </div>
    )
  }

  const { target, label, note } = CLOCK[phase]
  const ms = now === null ? null : Math.max(0, target.getTime() - now)
  const cells = [
    { v: ms === null ? null : Math.floor(ms / 86_400_000), l: 'hari' },
    { v: ms === null ? null : Math.floor(ms / 3_600_000) % 24, l: 'jam' },
    { v: ms === null ? null : Math.floor(ms / 60_000) % 60, l: 'menit' },
    { v: ms === null ? null : Math.floor(ms / 1000) % 60, l: 'detik' },
  ]
  return (
    <div className="relative z-10" role="timer" aria-label={label}>
      <p className="text-[0.9375rem] font-medium text-white/85">{label}</p>
      <div className="mt-2 flex gap-[5cqw]">
        {cells.map((c) => (
          <div key={c.l}>
            <div className="text-[clamp(2rem,11.5cqw,3.5rem)] leading-none font-extrabold tracking-[-0.03em] text-amber">
              {c.v === null ? '--' : String(c.v).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[0.8125rem] text-white/80">{c.l}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 max-w-[17rem] text-sm leading-snug text-white/80">{note}</p>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="wrap">
      <div className="bento">
        <div className="tile tile-white col-span-2 flex flex-col justify-center py-7 lg:col-span-7 lg:min-h-[35rem] lg:p-12">
          <p className="font-semibold text-pine">Program Kompetisi Ide &amp; Startup</p>
          <h1 className="h-hero mt-3">
            Bawa ide &amp; startup dari{' '}
            <span className="whitespace-nowrap">
              Indonesia
              <span className="flag-id" role="img" aria-label="bendera Indonesia" />
            </span>{' '}
            jadi perusahaan di Saudi Arabia.
          </h1>
          <p className="mt-5 max-w-[35rem] text-[1.0625rem] leading-relaxed text-muted-foreground">
            Program kurasi &amp; pendampingan untuk mengubah ide bisnis dan startup Indonesia menjadi perusahaan
            resmi di Saudi Arabia, sekaligus mendapatkan izin tinggal (Iqama) jalur startup untuk 2 orang (Founder
            &amp; Co-founder/Investor).
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a href="#proposal" className="btn btn-amber px-4 sm:px-6">
              Kirim ide &amp; proposal
            </a>
            <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-line px-4 sm:px-6">
              <WhatsAppIcon className="size-5 shrink-0" />
              Fast track WhatsApp
            </a>
          </div>
        </div>

        <div className="@container tile tile-emerald col-span-2 min-h-[22rem] sm:min-h-[26rem] lg:col-span-5 lg:p-9">
          <Clock />
          <Skyline className="absolute inset-x-0 bottom-0 h-[58%] w-full" />
        </div>
      </div>
    </section>
  )
}
