import { motion } from 'motion/react'
import { Compass, Handshake, Lightbulb, ShieldCheck, type LucideIcon } from 'lucide-react'

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

type Value = { icon: LucideIcon; title: string; desc: string }

const VALUES: Value[] = [
  {
    icon: ShieldCheck,
    title: 'Integritas',
    desc: 'Setiap rekomendasi disusun transparan, berbasis data, dan dapat dipertanggungjawabkan.',
  },
  {
    icon: Handshake,
    title: 'Kemitraan',
    desc: 'Kami bekerja sebagai perpanjangan tim Anda, bukan sekadar vendor eksternal.',
  },
  {
    icon: Compass,
    title: 'Terarah',
    desc: 'Strategi selalu diturunkan menjadi peta jalan implementasi yang jelas dan terukur.',
  },
  {
    icon: Lightbulb,
    title: 'Inovasi',
    desc: 'Metodologi kami diperbarui terus-menerus mengikuti praktik terbaik global.',
  },
]

export function About() {
  return (
    <section id="tentang" className="border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:gap-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          >
            Tentang Kami
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Dua dekade mendampingi transformasi perusahaan Indonesia
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-muted-foreground text-pretty">
            Kami adalah perusahaan jasa profesional yang berfokus pada peningkatan
            kinerja organisasi. Tim konsultan kami berasal dari beragam industri —
            manufaktur, keuangan, logistik, hingga teknologi — sehingga setiap
            solusi lahir dari pemahaman lapangan, bukan sekadar teori.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground text-pretty">
            Dengan 12 kantor cabang di kota-kota besar, kami hadir dekat dengan
            operasional klien: cepat merespons, memahami konteks lokal, dan
            berkomitmen pada hasil jangka panjang.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2"
        >
          {VALUES.map((value) => (
            <motion.div
              key={value.title}
              variants={fadeUp}
              className="rounded-xl border border-t-2 border-t-primary bg-card p-6"
            >
              <value.icon className="size-6 text-primary" />
              <h3 className="font-display mt-4 text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
