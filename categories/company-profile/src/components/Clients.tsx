import { motion } from 'motion/react'
import { Quote } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

type Client = { name: string; industry: string }

const CLIENTS: Client[] = [
  { name: 'Cakra Logistik', industry: 'Logistik' },
  { name: 'Grup Andalan', industry: 'Manufaktur' },
  { name: 'Bank Harapan', industry: 'Keuangan' },
  { name: 'Media Kirana', industry: 'Media' },
  { name: 'Energi Lestari', industry: 'Energi' },
  { name: 'Retail Sentosa', industry: 'Ritel' },
  { name: 'Agri Makmur', industry: 'Agrikultur' },
  { name: 'Telemitra', industry: 'Telekomunikasi' },
]

export function Clients() {
  return (
    <section id="klien" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
          >
            Dipercaya Oleh
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Klien lintas industri di seluruh Indonesia
          </motion.h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {CLIENTS.map((client) => (
            <motion.div
              key={client.name}
              variants={fadeUp}
              className="flex h-24 flex-col items-center justify-center rounded-lg border bg-card px-4 text-center"
            >
              <span className="font-display text-base font-semibold text-muted-foreground">
                {client.name}
              </span>
              <span className="mt-1 text-xs uppercase tracking-wider text-muted-foreground/60">
                {client.industry}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.figure
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-3xl rounded-2xl border bg-muted/50 p-8 text-center sm:p-12"
        >
          <motion.div variants={fadeUp} className="flex justify-center">
            <Quote className="size-8 text-primary/40" />
          </motion.div>
          <motion.blockquote
            variants={fadeUp}
            className="font-display mt-5 text-xl font-medium leading-relaxed text-balance sm:text-2xl"
          >
            “Pendampingan mereka mengubah cara kami mengambil keputusan.
            Dalam dua tahun, biaya operasional turun 23% tanpa mengorbankan
            kualitas layanan.”
          </motion.blockquote>
          <motion.figcaption variants={fadeUp} className="mt-6 text-sm text-muted-foreground">
            Direktur Operasional — perusahaan logistik nasional
          </motion.figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
