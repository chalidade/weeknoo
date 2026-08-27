import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

type Package = {
  name: string
  price: string
  description: string
  features: string[]
  featured: boolean
}

const PACKAGES: Package[] = [
  {
    name: 'Sesi Potret',
    price: 'Rp 3.500.000',
    description: 'Prewedding, keluarga, atau potret personal — setengah hari.',
    features: [
      'Sesi 3 jam, 1 lokasi',
      '60 foto teredit penuh',
      'Galeri online privat',
      'Semua file resolusi tinggi',
    ],
    featured: false,
  },
  {
    name: 'Intimate Wedding',
    price: 'Rp 9.500.000',
    description: 'Untuk akad dan resepsi kecil hingga 100 tamu, satu hari penuh.',
    features: [
      'Liputan 8 jam, 2 fotografer',
      '300+ foto teredit penuh',
      'Album cetak 20 halaman',
      'Sneak peek 24 jam',
      'Galeri online privat',
    ],
    featured: true,
  },
  {
    name: 'Full Day Wedding',
    price: 'Rp 16.000.000',
    description: 'Dokumentasi lengkap dari persiapan pagi sampai resepsi malam.',
    features: [
      'Liputan 12 jam, 3 fotografer',
      '500+ foto teredit penuh',
      'Album cetak premium 30 halaman',
      'Sesi potret keluarga besar',
      'Prioritas jadwal luar kota',
    ],
    featured: false,
  },
]

export function Packages() {
  return (
    <section id="packages" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
        >
          Paket
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display mt-4 max-w-2xl text-3xl font-light tracking-tight sm:text-5xl"
        >
          Investasi untuk kenangan seumur hidup
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-xl text-muted-foreground">
          Semua paket termasuk konsultasi konsep, kurasi, dan olah warna. Detail
          dapat disesuaikan dengan rangkaian acara Anda.
        </motion.p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <motion.article
              key={pkg.name}
              variants={fadeUp}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                pkg.featured ? 'border-primary/60 bg-card' : 'bg-card/50'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Paling populer
                </span>
              )}
              <h3 className="text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
                {pkg.name}
              </h3>
              <p className="font-display mt-4 text-3xl font-light">{pkg.price}</p>
              <p className="mt-3 text-sm text-muted-foreground">{pkg.description}</p>
              <ul className="mt-6 flex-1 space-y-3 border-t pt-6">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={cn(
                  buttonVariants({
                    size: 'lg',
                    variant: pkg.featured ? 'default' : 'outline',
                  }),
                  'mt-8'
                )}
              >
                Tanya Paket Ini
              </a>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
