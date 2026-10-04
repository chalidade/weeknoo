import { motion } from 'motion/react'
import { CalendarHeart, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { waLink } from '@/lib/cafe'

export function Cta() {
  return (
    <section id="reservasi" className="px-5 pb-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-20"
      >
        <div aria-hidden className="honeycomb absolute inset-0 text-primary-foreground/10" />
        <Logo className="relative mx-auto size-20 text-primary-foreground" />
        <h2 className="relative mx-auto mt-6 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
          Mau bikin acara di rumah lebah?
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-lg text-primary-foreground/85">
          Gathering kantor, reuni, ulang tahun, sampai lamaran — kabari kami
          tanggal dan jumlah tamunya, tim Ha.Chi.Li bantu siapkan.
        </p>
        <div className="relative mt-9 flex flex-wrap justify-center gap-3">
          <a
            href={waLink('Halo Ha.Chi.Li, saya mau reservasi tempat untuk acara. Tanggal: … Jumlah tamu: … 🐝')}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: 'lg', variant: 'secondary' }), 'h-12 rounded-full px-7 text-base')}
          >
            <CalendarHeart />
            Reservasi Acara
          </a>
          <a
            href={waLink()}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'h-12 rounded-full border-primary-foreground/40 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
            )}
          >
            <MessageCircle />
            Chat Barista
          </a>
        </div>
      </motion.div>
    </section>
  )
}
