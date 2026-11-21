import { Mail } from 'lucide-react'
import { EMAIL, WA_DISPLAY, mailtoUrl, waUrl } from '@/lib/contact'
import { WhatsAppIcon } from '@/components/icons'

export function Cta() {
  return (
    <section id="daftar" className="wrap mt-2.5 scroll-mt-20 sm:mt-4">
      <div className="bento">
        <div className="tile tile-amber col-span-2 py-8 lg:col-span-12 lg:p-12">
          <h2 className="text-[clamp(1.3rem,4.4vw,1.9rem)] leading-tight font-bold tracking-[-0.02em]">
            Kirim ide &amp; proposal ke
          </h2>
          <a
            href={mailtoUrl()}
            className="mt-1.5 block max-w-full text-[clamp(2rem,10.2vw,6rem)] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap underline-offset-[0.12em] hover:underline"
          >
            {EMAIL}
          </a>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <a href={mailtoUrl()} className="btn btn-ink">
              <Mail className="size-5 shrink-0" aria-hidden="true" />
              Daftar lewat email
            </a>
            <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-white">
              <WhatsAppIcon className="size-5 shrink-0" />
              <span className="hidden sm:inline">Fast track</span>
              {WA_DISPLAY}
            </a>
          </div>
          <p className="mt-6 max-w-xl leading-relaxed font-semibold">
            Sudah menghubungi lewat WhatsApp? Jangan lupa kirim email ke email kami juga.
          </p>
        </div>
      </div>
    </section>
  )
}
