import { motion } from 'motion/react'
import { AtSign, Clock, MapPin, MessageCircle, Navigation, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { CAFE, waLink } from '@/lib/cafe'

const INFO = [
  { icon: MapPin, label: 'Alamat', value: CAFE.address },
  { icon: Clock, label: 'Jam buka', value: CAFE.hours },
  { icon: Wallet, label: 'Kisaran harga', value: `${CAFE.priceRange} per menu` },
  { icon: MessageCircle, label: 'WhatsApp', value: CAFE.phone, href: waLink() },
  { icon: AtSign, label: 'Instagram', value: CAFE.instagram, href: CAFE.instagramUrl },
]

export function Lokasi() {
  return (
    <section id="lokasi" className="scroll-mt-16 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid overflow-hidden rounded-[2rem] border bg-card lg:grid-cols-[1fr_1.2fr]"
        >
          <div className="p-7 sm:p-10">
            <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Lokasi</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Mampir ke sarang
            </h2>
            <ul className="mt-8 space-y-5">
              {INFO.map((row) => (
                <li key={row.label} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <row.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{row.label}</p>
                    {row.href ? (
                      <a href={row.href} target="_blank" rel="noreferrer" className="font-medium hover:text-primary">
                        {row.value}
                      </a>
                    ) : (
                      <p className="font-medium">{row.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={CAFE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: 'lg' }), 'mt-9 h-12 rounded-full px-7')}
            >
              <Navigation />
              Buka di Google Maps
            </a>
          </div>
          <div className="relative min-h-80 bg-muted">
            <iframe
              title="Peta lokasi Ha.Chi.Li Coffee"
              src={CAFE.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 grayscale-[30%]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
