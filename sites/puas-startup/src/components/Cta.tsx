import { motion } from 'motion/react'
import { ArrowRight, Mail } from 'lucide-react'
import { EMAIL, WA_DISPLAY, mailtoUrl, waUrl } from '@/lib/contact'
import { WhatsAppIcon } from '@/components/icons'
import { Skyline } from '@/components/Skyline'

export function Cta() {
  return (
    <section id="daftar" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="ring-gold relative isolate overflow-hidden rounded-[2rem] bg-emerald px-5 pt-14 pb-40 text-center sm:px-12 sm:pt-20 sm:pb-52"
        >
          <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
          <div className="absolute -bottom-40 left-1/2 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(251_180_74/0.4),transparent)] blur-2xl" />
          <Skyline className="absolute inset-x-0 bottom-0 -z-10 h-32 opacity-80 sm:h-44" />
          <img
            src={`${import.meta.env.BASE_URL}puas-mark.png`}
            alt=""
            className="mx-auto size-16 drop-shadow-[0_10px_30px_rgb(0_0_0/0.5)]"
          />
          <p className="mt-6 font-mono text-xs tracking-[0.25em] text-primary uppercase">Kirim ide & proposal</p>
          <h2 className="font-display mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Ide Anda bisa jadi perusahaan <span className="text-gold">berikutnya di Saudi.</span>
          </h2>
          <a
            href={mailtoUrl()}
            className="font-display text-gold mt-8 inline-block max-w-full text-[clamp(1.25rem,6vw,2.25rem)] font-bold whitespace-nowrap underline-offset-8 hover:underline"
          >
            {EMAIL}
          </a>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={mailtoUrl()}
              className="group bg-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold whitespace-nowrap text-primary-foreground shadow-xl shadow-gold-1/25 transition-transform hover:scale-[1.03]"
            >
              <Mail className="size-5" /> Daftar via Email
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 font-semibold whitespace-nowrap text-[#062b1a] transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="size-5 shrink-0" /> Fast Track: {WA_DISPLAY}
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
            Sudah menghubungi via WhatsApp? <strong className="text-foreground">Jangan lupa tetap kirim proposal ke email kami juga.</strong>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
