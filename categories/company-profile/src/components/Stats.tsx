import { motion } from 'motion/react'

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

type Stat = { value: string; label: string }

const STATS: Stat[] = [
  { value: '18+', label: 'Tahun berdiri' },
  { value: '250+', label: 'Klien korporat aktif' },
  { value: '12', label: 'Kantor cabang nasional' },
  { value: '98%', label: 'Tingkat retensi klien' },
]

export function Stats() {
  return (
    <section id="statistik" className="bg-primary text-primary-foreground">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-6 py-20 text-center sm:py-24 lg:grid-cols-4"
      >
        {STATS.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <p className="font-display text-4xl font-semibold sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-3 text-sm text-primary-foreground/80">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
