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

type Plan = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: 'Rp99.000',
    period: '/bulan',
    description: 'Untuk usaha yang baru mulai merapikan keuangan.',
    features: [
      '50 faktur per bulan',
      '1 pengguna',
      'Laporan laba rugi & arus kas',
      'Pengingat tagihan otomatis',
      'Dukungan email',
    ],
    cta: 'Mulai Gratis',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 'Rp299.000',
    period: '/bulan',
    description: 'Untuk tim yang butuh kolaborasi dan otomasi penuh.',
    features: [
      'Faktur tanpa batas',
      '5 pengguna',
      'Rekonsiliasi bank otomatis',
      'Faktur pajak & rekap PPN',
      'Integrasi marketplace & POS',
      'Dukungan prioritas via chat',
    ],
    cta: 'Coba Gratis 14 Hari',
    highlighted: true,
  },
  {
    name: 'Scale',
    price: 'Rp799.000',
    period: '/bulan',
    description: 'Untuk bisnis multi-cabang dengan kebutuhan lanjutan.',
    features: [
      'Semua fitur Growth',
      'Pengguna tanpa batas',
      'Multi-entitas & multi-cabang',
      'Akses API penuh',
      'Manajer akun khusus',
      'SLA 99,9% dengan kontrak',
    ],
    cta: 'Hubungi Sales',
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="harga" className="border-t bg-card/40 py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <div className="text-center">
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold tracking-widest text-primary uppercase"
          >
            Harga
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            Harga transparan, naik kelas kapan saja
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Semua paket termasuk pembaruan fitur dan enkripsi data. Bayar
            tahunan dan hemat 2 bulan.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={cn(
                'relative flex flex-col rounded-xl border bg-card p-8',
                plan.highlighted &&
                  'border-primary/60 shadow-[0_0_40px_-12px] shadow-primary/30 ring-1 ring-primary/60',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Paling Populer
                </span>
              )}
              <h3 className="font-display text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-3xl font-extrabold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#mulai"
                className={cn(
                  buttonVariants({
                    size: 'lg',
                    variant: plan.highlighted ? 'default' : 'outline',
                  }),
                  'mt-8 w-full',
                )}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
