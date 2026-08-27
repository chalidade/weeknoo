import { motion } from 'motion/react'
import {
  BarChart3,
  Briefcase,
  GraduationCap,
  MonitorSmartphone,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'

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

type Service = { number: string; icon: LucideIcon; title: string; desc: string }

const SERVICES: Service[] = [
  {
    number: '01',
    icon: Briefcase,
    title: 'Konsultansi Manajemen',
    desc: 'Perancangan strategi korporat, restrukturisasi organisasi, dan peningkatan kinerja operasional.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Alih Daya SDM',
    desc: 'Penyediaan dan pengelolaan tenaga kerja profesional dengan kepatuhan ketenagakerjaan penuh.',
  },
  {
    number: '03',
    icon: GraduationCap,
    title: 'Pelatihan Korporat',
    desc: 'Program pengembangan kepemimpinan dan kompetensi teknis, di kelas maupun daring.',
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'Audit & Kepatuhan',
    desc: 'Audit internal, manajemen risiko, dan pendampingan sertifikasi standar industri.',
  },
  {
    number: '05',
    icon: MonitorSmartphone,
    title: 'Transformasi Digital',
    desc: 'Digitalisasi proses bisnis end-to-end, dari pemetaan proses hingga adopsi sistem.',
  },
  {
    number: '06',
    icon: BarChart3,
    title: 'Riset Pasar',
    desc: 'Studi kelayakan, analisis kompetitor, dan riset perilaku konsumen berbasis data primer.',
  },
]

export function Services() {
  return (
    <section id="layanan" className="border-t bg-muted/50">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          >
            Layanan Kami
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Enam lini jasa, satu standar kualitas
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Setiap penugasan dikelola oleh tim khusus dengan indikator keberhasilan
            yang disepakati sejak awal.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <motion.article
              key={service.number}
              variants={fadeUp}
              className="group rounded-xl border bg-card p-7 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <service.icon className="size-5" />
                </span>
                <span className="font-display text-sm font-medium text-muted-foreground/60">
                  {service.number}
                </span>
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
