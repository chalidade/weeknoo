import { Check, Megaphone } from 'lucide-react'
import { WA_DISPLAY, waUrl } from '@/lib/contact'
import { WhatsAppIcon } from '@/components/icons'

const WHO = [
  'Ide bisnis baru (startup)',
  'Ekspansi bisnis Indonesia ke Saudi',
  'Solusi teknologi, layanan, atau model bisnis untuk pasar Saudi & GCC',
]

export function Eligibility() {
  return (
    <section id="peserta" className="wrap mt-2.5 scroll-mt-20 sm:mt-4">
      <div className="bento">
        <div className="tile tile-white col-span-2 lg:col-span-7">
          <h2 className="flex items-center gap-3 text-[1.5rem] leading-none font-extrabold tracking-[-0.03em]">
            <span className="chip bg-amber text-ink">
              <Megaphone className="size-6" strokeWidth={1.9} aria-hidden="true" />
            </span>
            Terbuka untuk (startup):
          </h2>
          <ul className="mt-5 grid gap-2.5">
            {WHO.map((w) => (
              <li key={w} className="flex items-start gap-3 rounded-2xl bg-mist p-4 leading-snug font-semibold">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald text-white">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="tile tile-ink col-span-2 flex flex-col justify-between gap-8 lg:col-span-5">
          <div>
            <p className="font-semibold text-amber">Mau jalur cepat?</p>
            <h2 className="mt-1 text-[clamp(2rem,8.4vw,3.1rem)] leading-none font-extrabold tracking-[-0.045em]">
              Fast track? Call us!
            </h2>
          </div>
          <div>
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[clamp(1.6rem,7.2vw,2.4rem)] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap underline-offset-4 hover:underline"
            >
              {WA_DISPLAY}
            </a>
            <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-5 w-full sm:w-auto">
              <WhatsAppIcon className="size-5 shrink-0" />
              Chat lewat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
