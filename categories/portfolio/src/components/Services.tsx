import { motion } from 'motion/react'
import { Code2, Layers, Palette, PenTool, type LucideIcon } from 'lucide-react'

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

type Service = {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Desain UI/UX',
    description:
      'Riset pengguna, wireframe, hingga antarmuka high-fidelity yang siap diuji dan dikembangkan.',
    icon: PenTool,
  },
  {
    number: '02',
    title: 'Pengembangan Web',
    description:
      'Frontend React + TypeScript yang cepat, aksesibel, dan mudah dirawat oleh tim internal Anda.',
    icon: Code2,
  },
  {
    number: '03',
    title: 'Identitas Visual',
    description:
      'Logo, palet warna, dan tipografi yang konsisten dari kartu nama sampai layar aplikasi.',
    icon: Palette,
  },
  {
    number: '04',
    title: 'Design System',
    description:
      'Komponen terdokumentasi dengan token warna dan spacing agar produk tumbuh tanpa berantakan.',
    icon: Layers,
  },
]

export function Services() {
  return (
    <section id="services" className="border-t bg-background py-20 sm:py-24">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-6xl px-6"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium tracking-widest text-primary uppercase"
        >
          Layanan
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Apa yang bisa saya kerjakan untuk Anda
        </motion.h2>

        <div className="mt-12 divide-y border-y">
          {SERVICES.map((service) => (
            <motion.div
              key={service.number}
              variants={fadeUp}
              className="grid gap-4 py-8 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8"
            >
              <span className="font-display text-sm font-bold text-primary">
                {service.number}
              </span>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-xl border bg-card">
                <service.icon className="size-5 text-primary" />
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
