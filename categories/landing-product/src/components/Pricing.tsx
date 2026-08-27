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
  originalPrice?: string
  description: string
  features: string[]
  highlighted: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Solo',
    price: 'Rp649.000',
    description: 'Satu gelang untuk memulai hidup sehatmu.',
    features: [
      '1 unit gelang pintar',
      'Strap silikon hitam',
      'Kabel pengisi daya magnetik',
      'Garansi resmi 12 bulan',
      'Akses penuh aplikasi, gratis',
    ],
    highlighted: false,
  },
  {
    name: 'Duo',
    price: 'Rp1.199.000',
    originalPrice: 'Rp1.298.000',
    description: 'Paket berdua — lebih hemat, lebih semangat.',
    features: [
      '2 unit gelang pintar',
      'Pilihan 4 warna strap',
      'Kabel pengisi daya magnetik x2',
      'Garansi resmi 12 bulan',
      'Tantangan duo di aplikasi',
      'Gratis ongkir seluruh Indonesia',
    ],
    highlighted: true,
  },
  {
    name: 'Keluarga',
    price: 'Rp2.199.000',
    originalPrice: 'Rp2.596.000',
    description: 'Empat gelang untuk seisi rumah.',
    features: [
      '4 unit gelang pintar',
      'Pilihan 4 warna strap',
      'Dasbor keluarga di aplikasi',
      'Garansi resmi 18 bulan',
      'Prioritas dukungan pelanggan',
      'Gratis ongkir seluruh Indonesia',
    ],
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="harga" className="bg-muted/50 py-20 sm:py-24">
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
            Sekali bayar, milikmu selamanya
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-muted-foreground"
          >
            Tanpa biaya langganan. Aplikasi dan semua pembaruan fitur gratis
            selamanya untuk setiap pembelian.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={cn(
                'relative flex flex-col rounded-xl border bg-card p-8',
                plan.highlighted && 'border-primary shadow-lg ring-1 ring-primary',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Paling Laris
                </span>
              )}
              <h3 className="font-display text-lg font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold">
                  {plan.price}
                </span>
                {plan.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {plan.originalPrice}
                  </span>
                )}
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
                href="#pesan"
                className={cn(
                  buttonVariants({
                    size: 'lg',
                    variant: plan.highlighted ? 'default' : 'outline',
                  }),
                  'mt-8 w-full',
                )}
              >
                Pilih Paket {plan.name}
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
